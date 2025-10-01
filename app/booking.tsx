/**
 * Salon Booking Application
 * 
 * A complete salon booking system with user authentication, multi-step booking flow,
 * and integration with Apollo Server GraphQL backend.
 * 
 * Features:
 * - User authentication (login/signup) with password validation
 * - Multi-step booking workflow (salon → services → staff → schedule → confirmation)
 * - User-specific booking management
 * - Responsive UI with bottom navigation
 * - Real-time data persistence via Apollo Server
 * 
 * Architecture:
 * - Frontend: React Native with TypeScript
 * - State Management: React hooks (useState, useEffect)
 * - Backend: Apollo Server (GraphQL) with JSON file persistence
 * - Navigation: Tab-based navigation with step-based flow
 * 
 * @module SalonBookingApp
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { mockGraphQL, Salon, Service, Staff, Schedule, User as GraphQLUser } from '../services/mockGraphQLService';
import AppBar from '../components/AppBar';
import BottomNav, { TabType } from '../components/BottomNav';
import { COLORS } from '../styles/theme';
import { styles } from '../styles/booking.styles';

/**
 * Represents the current step in the booking flow
 */
type Step = 'login' | 'signup' | 'salon' | 'services' | 'staff' | 'schedule' | 'confirmation' | 'success';

/**
 * Main application component that handles the complete salon booking flow
 * 
 * State Management:
 * - Authentication: User login/signup state and credentials
 * - Navigation: Current tab and booking step
 * - Booking Data: Salons, services, staff, schedules from backend
 * - User Selections: Current booking choices
 * - Bookings: User's confirmed appointments
 * 
 * @returns {JSX.Element} The complete salon booking application
 */
export default function SalonBookingApp() {
  // ==================== STATE MANAGEMENT ====================
  
  /**
   * Authentication State
   * Manages user authentication status and login credentials
   */
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<GraphQLUser | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  /**
   * Signup State
   * Manages new user registration form data
   */
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  /**
   * Navigation State
   * Tracks the active tab in bottom navigation
   */
  const [activeTab, setActiveTab] = useState<TabType>('home');

  /**
   * Booking Flow State
   * Manages the current step in the booking process and loading status
   */
  const [step, setStep] = useState<Step>('login');
  const [loading, setLoading] = useState(false);

  /**
   * Data State
   * Stores data fetched from the GraphQL backend
   */
  const [salons, setSalons] = useState<Salon[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  /**
   * User Selection State
   * Tracks the user's current booking selections
   */
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  /**
   * Bookings State
   * Stores the user's confirmed bookings
   */
  const [myBookings, setMyBookings] = useState<any[]>([]);

  // ==================== AUTHENTICATION HANDLERS ====================
  
  /**
   * Handles user login
   * 
   * Process:
   * 1. Sends login credentials to GraphQL backend
   * 2. On success: Sets authentication state, clears selections, loads salon data
   * 3. On failure: Shows error alert
   * 
   * @async
   */
  const handleLogin = async () => {
    try {
      const response = await mockGraphQL.login({ email, password });
      
      if (response.success && response.user) {
        setIsAuthenticated(true);
        setCurrentUser(response.user);
        setStep('salon');
        // Clear any previous selections
        setSelectedSalon(null);
        setSelectedServices([]);
        setSelectedStaff(null);
        setSelectedSchedule(null);
        loadSalons();
        setEmail('');
        setPassword('');
      } else {
        Alert.alert('Login Failed', response.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    }
  };

  /**
   * Handles user signup/registration
   * 
   * Process:
   * 1. Validates password confirmation match
   * 2. Sends registration data to GraphQL backend
   * 3. On success: Switches to login screen with pre-filled email
   * 4. On failure: Shows error alert
   * 
   * @async
   */
  const handleSignup = async () => {
    // Frontend validation for password match
    if (signupPassword !== signupConfirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await mockGraphQL.register({
        name: signupName,
        phone: signupPhone,
        email: signupEmail,
        password: signupPassword,
      });

      if (response.success) {
        // Automatically switch to login and pre-fill email
        setEmail(signupEmail);
        setSignupName('');
        setSignupPhone('');
        setSignupEmail('');
        setSignupPassword('');
        setSignupConfirmPassword('');
        setStep('login');
        
        // Show success message after switching
        setTimeout(() => {
          Alert.alert(
            'Account Created!',
            `Welcome ${response.user?.name}! Please login with your credentials.`,
            [{ text: 'OK' }]
          );
        }, 100);
      } else {
        Alert.alert('Registration Failed', response.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles user logout
   * Clears all authentication state and booking selections
   */
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setStep('login');
    setEmail('');
    setPassword('');
    // Clear all booking selections
    setSelectedSalon(null);
    setSelectedServices([]);
    setSelectedStaff(null);
    setSelectedSchedule(null);
    setMyBookings([]);
  };

  // ==================== DATA LOADING FUNCTIONS ====================
  
  /**
   * Loads all available salons from the backend
   * @async
   */
  const loadSalons = async () => {
    setLoading(true);
    const data = await mockGraphQL.getSalons();
    setSalons(data);
    setLoading(false);
  };

  /**
   * Loads the current user's bookings from the backend
   * Filters bookings by user ID to ensure user-specific data
   * @async
   */
  const loadMyBookings = async () => {
    if (!currentUser) return;
    try {
      const bookings = await mockGraphQL.getBookings(currentUser.id);
      setMyBookings(bookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  // ==================== LIFECYCLE EFFECTS ====================
  
  /**
   * Effect: Load initial data when user authenticates
   * Runs when authentication state or current user changes
   */
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadSalons();
      loadMyBookings();
    }
  }, [isAuthenticated, currentUser]);

  /**
   * Effect: Reset booking flow when switching to home tab
   * Prevents state persistence issues when navigating between tabs
   */
  useEffect(() => {
    if (activeTab === 'home' && isAuthenticated) {
      // Only reset if we're not at login/signup/salon steps
      if (step !== 'login' && step !== 'signup' && step !== 'salon') {
        setStep('salon');
        setSelectedSalon(null);
        setSelectedServices([]);
        setSelectedStaff(null);
        setSelectedSchedule(null);
      }
    }
  }, [activeTab]);

  // ==================== BOOKING FLOW HANDLERS ====================
  
  /**
   * Step 1: Select Salon
   * 
   * Handles salon selection and fetches available services for that salon
   * @param {Salon} salon - The selected salon
   * @async
   */
  const handleSalonSelect = async (salon: Salon) => {
    setSelectedSalon(salon);
    setLoading(true);
    const data = await mockGraphQL.getServices(salon.id);
    setServices(data);
    setLoading(false);
    setStep('services');
  };

  /**
   * Step 2: Toggle Service Selection
   * 
   * Allows multiple service selection by adding/removing services
   * @param {Service} service - The service to toggle
   */
  const toggleService = (service: Service) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  /**
   * Proceed to Staff Selection
   * 
   * Validates that at least one service is selected, then fetches staff
   * @async
   */
  const proceedToStaff = async () => {
    if (selectedServices.length === 0) {
      Alert.alert('Error', 'Please select at least one service');
      return;
    }
    setLoading(true);
    const data = await mockGraphQL.getStaff(selectedSalon!.id);
    setStaff(data);
    setLoading(false);
    setStep('staff');
  };

  /**
   * Step 3: Select Staff
   * 
   * Handles staff selection and fetches their available schedule
   * @param {Staff} staffMember - The selected staff member
   * @async
   */
  const handleStaffSelect = async (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setLoading(true);
    const data = await mockGraphQL.getStaffSchedules(staffMember.id);
    setSchedules(data);
    setLoading(false);
    setStep('schedule');
  };

  /**
   * Step 4: Select Schedule
   * 
   * Handles time slot selection (only if available)
   * @param {Schedule} schedule - The selected time slot
   */
  const handleScheduleSelect = (schedule: Schedule) => {
    if (!schedule.isAvailable) return;
    setSelectedSchedule(schedule);
    setStep('confirmation');
  };

  /**
   * Step 5: Confirm Booking
   * 
   * Creates the booking in the backend and adds it to user's bookings
   * @async
   */
  const confirmBooking = async () => {
    setLoading(true);
    try {
      const booking = await mockGraphQL.createBooking({
        userId: currentUser!.id,
        salonId: selectedSalon!.id,
        serviceIds: selectedServices.map(s => s.id),
        staffId: selectedStaff!.id,
        time: selectedSchedule!.time,
      });
      
      // Save booking to state
      setMyBookings(prev => [...prev, booking]);
      
      // Show success page
      setStep('success');
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    }
    setLoading(false);
  };

  /**
   * Reset Booking Flow
   * 
   * Clears all selections and returns to salon selection step
   */
  const resetBooking = () => {
    setStep('salon');
    setSelectedSalon(null);
    setSelectedServices([]);
    setSelectedStaff(null);
    setSelectedSchedule(null);
    loadSalons();
  };

  /**
   * Calculate Total Price
   * 
   * Sums up the prices of all selected services
   * @returns {number} Total price of selected services
   */
  const getTotalPrice = () => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  };

  // ==================== NAVIGATION HANDLERS ====================
  
  /**
   * Handle Back Navigation
   * 
   * Navigates to the previous step and clears related selections
   */
  const handleBack = () => {
    switch (step) {
      case 'services':
        setStep('salon');
        setSelectedServices([]);
        break;
      case 'staff':
        setStep('services');
        setSelectedStaff(null);
        break;
      case 'schedule':
        setStep('staff');
        setSelectedSchedule(null);
        break;
      case 'confirmation':
        setStep('schedule');
        break;
      case 'success':
        resetBooking(); // Go back to salon selection
        break;
      default:
        break;
    }
  };

  /**
   * Determine if Back Button Should Be Shown
   * 
   * @returns {boolean} True if back button should be visible
   */
  const shouldShowBack = () => {
    return step !== 'salon' && step !== 'login' && step !== 'signup' && step !== 'success';
  };

  // ==================== RENDER FUNCTIONS ====================
  
  /**
   * Render Tab Content
   * 
   * Renders the appropriate content based on the active tab
   * @returns {JSX.Element} The content for the active tab
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return renderContent();
      case 'bookings':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.stepTitle}>My Bookings</Text>
            <Text style={styles.subtitle}>
              {myBookings.length > 0 
                ? `You have ${myBookings.length} booking${myBookings.length > 1 ? 's' : ''}` 
                : 'Your booking history will appear here'}
            </Text>
            {myBookings.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>📅</Text>
                <Text style={styles.emptySubtext}>No bookings yet</Text>
              </View>
            ) : (
              myBookings.map((booking, index) => (
                <View key={booking.id} style={styles.card}>
                  <Text style={styles.cardTitle}>Booking #{myBookings.length - index}</Text>
                  <Text style={styles.cardSubtitle}>ID: {booking.id}</Text>
                  <View style={styles.divider} />
                  <View style={styles.confirmRow}>
                    <Text style={styles.confirmLabel}>Salon:</Text>
                    <Text style={styles.confirmValue}>{booking.salon.name}</Text>
                  </View>
                  <View style={styles.confirmRow}>
                    <Text style={styles.confirmLabel}>Staff:</Text>
                    <Text style={styles.confirmValue}>{booking.staff.name}</Text>
                  </View>
                  <View style={styles.confirmRow}>
                    <Text style={styles.confirmLabel}>Time:</Text>
                    <Text style={styles.confirmValue}>{booking.time}</Text>
                  </View>
                  <View style={styles.confirmRow}>
                    <Text style={styles.confirmLabel}>Services:</Text>
                    <Text style={styles.confirmValue}>
                      {booking.services.map((s: any) => s.name).join(', ')}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        );
      case 'profile':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.stepTitle}>Profile</Text>
            <View style={styles.profileCard}>
              <Text style={styles.profileLabel}>Name</Text>
              <Text style={styles.profileValue}>{currentUser?.name || 'N/A'}</Text>
              
              <Text style={styles.profileLabel}>Phone</Text>
              <Text style={styles.profileValue}>{currentUser?.phone || 'N/A'}</Text>
              
              <Text style={styles.profileLabel}>Email</Text>
              <Text style={styles.profileValue}>{currentUser?.email || 'N/A'}</Text>
              
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return renderContent();
    }
  };

  // AUTH SCREENS (LOGIN & SIGNUP)
  if (step === 'login' || step === 'signup') {
    return (
      <View style={styles.container}>
        {step === 'signup' ? (
          <View style={styles.loginContainer}>
            <Text style={styles.loginTitle}>Create Account</Text>
            <Text style={styles.loginSubtitle}>Sign up to start booking</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={signupName}
              onChangeText={setSignupName}
              autoCapitalize="words"
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={signupPhone}
              onChangeText={setSignupPhone}
              keyboardType="phone-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={signupEmail}
              onChangeText={setSignupEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              placeholder="Password (min 6 characters)"
              value={signupPassword}
              onChangeText={setSignupPassword}
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={signupConfirmPassword}
              onChangeText={setSignupConfirmPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchAuthButton} 
              onPress={() => {
                setStep('login');
                setSignupName('');
                setSignupPhone('');
                setSignupEmail('');
                setSignupPassword('');
                setSignupConfirmPassword('');
              }}
            >
              <Text style={styles.switchAuthText}>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.loginContainer}>
            <Text style={styles.loginTitle}>Salon Booking</Text>
            <Text style={styles.loginSubtitle}>Sign in to book your appointment</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchAuthButton} 
              onPress={() => setStep('signup')}
            >
              <Text style={styles.switchAuthText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>


          </View>
        )}
      </View>
    );
  }

  // Render different steps (same as before)
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    switch (step) {
      case 'salon':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Salons</Text>
            {salons.map(salon => (
              <TouchableOpacity
                key={salon.id}
                style={styles.card}
                onPress={() => handleSalonSelect(salon)}
              >
                <Text style={styles.cardTitle}>{salon.name}</Text>
                <Text style={styles.cardSubtitle}>{salon.address}</Text>
                <Text style={styles.cardRating}>★ {salon.rating}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'services':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select Services</Text>
            <Text style={styles.subtitle}>Salon: {selectedSalon?.name}</Text>
            {services.map(service => {
              const isSelected = !!selectedServices.find(s => s.id === service.id);
              return (
                <TouchableOpacity
                  key={service.id}
                  style={[styles.card, isSelected && styles.cardSelected]}
                  onPress={() => toggleService(service)}
                >
                  <View style={styles.serviceRow}>
                    <View>
                      <Text style={styles.cardTitle}>{service.name}</Text>
                      <Text style={styles.cardPrice}>${service.price}</Text>
                    </View>
                    {isSelected && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
            {selectedServices.length > 0 && (
              <View style={styles.totalBox}>
                <Text style={styles.totalText}>Total: ${getTotalPrice()}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.button} onPress={proceedToStaff}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        );

      case 'staff':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select Staff</Text>
            <Text style={styles.subtitle}>Salon: {selectedSalon?.name}</Text>
            {staff.map(member => (
              <TouchableOpacity
                key={member.id}
                style={styles.card}
                onPress={() => handleStaffSelect(member)}
              >
                <View style={styles.staffRow}>
                  <Image source={{ uri: member.photo }} style={styles.staffPhoto} />
                  <View style={styles.staffInfo}>
                    <Text style={styles.cardTitle}>{member.name}</Text>
                    <Text style={styles.cardSubtitle}>{member.specialization}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'schedule':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select Time Slot</Text>
            <Text style={styles.subtitle}>Staff: {selectedStaff?.name}</Text>
            <View style={styles.scheduleGrid}>
              {schedules.map(schedule => (
                <TouchableOpacity
                  key={schedule.id}
                  style={[
                    styles.timeSlot,
                    !schedule.isAvailable && styles.timeSlotDisabled,
                    selectedSchedule?.id === schedule.id && styles.timeSlotSelected,
                  ]}
                  onPress={() => handleScheduleSelect(schedule)}
                  disabled={!schedule.isAvailable}
                >
                  <Text
                    style={[
                      styles.timeText,
                      !schedule.isAvailable && styles.timeTextDisabled,
                    ]}
                  >
                    {schedule.time}
                  </Text>
                  {!schedule.isAvailable && (
                    <Text style={styles.unavailableText}>Unavailable</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'confirmation':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Confirm Booking</Text>
            <View style={styles.confirmCard}>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Salon:</Text>
                <Text style={styles.confirmValue}>{selectedSalon?.name}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Address:</Text>
                <Text style={styles.confirmValue}>{selectedSalon?.address}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Staff:</Text>
                <Text style={styles.confirmValue}>{selectedStaff?.name}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Time:</Text>
                <Text style={styles.confirmValue}>{selectedSchedule?.time}</Text>
              </View>
              <View style={styles.divider} />
              <Text style={styles.confirmLabel}>Services:</Text>
              {selectedServices.map(service => (
                <View key={service.id} style={styles.serviceRow}>
                  <Text style={styles.confirmValue}>{service.name}</Text>
                  <Text style={styles.confirmValue}>${service.price}</Text>
                </View>
              ))}
              <View style={styles.divider} />
              <View style={styles.confirmRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>${getTotalPrice()}</Text>
              </View>
            </View>
            
            {loading ? (
              <View style={styles.loading}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Creating your booking...</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.confirmButton} onPress={confirmBooking}>
                <Text style={styles.buttonText}>Confirm Booking</Text>
              </TouchableOpacity>
            )}
          </View>
        );

      case 'success':
        const lastBooking = myBookings[myBookings.length - 1];
        return (
          <View style={styles.stepContainer}>
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.successTitle}>Booking Confirmed!</Text>
              <Text style={styles.successSubtitle}>Your appointment has been scheduled</Text>
              
              <View style={styles.confirmCard}>
                <Text style={styles.bookingIdLabel}>Booking ID</Text>
                <Text style={styles.bookingId}>{lastBooking.id}</Text>
                
                <View style={styles.divider} />
                
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Salon:</Text>
                  <Text style={styles.confirmValue}>{lastBooking.salon.name}</Text>
                </View>
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Staff:</Text>
                  <Text style={styles.confirmValue}>{lastBooking.staff.name}</Text>
                </View>
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Time:</Text>
                  <Text style={styles.confirmValue}>{lastBooking.time}</Text>
                </View>
                <View style={styles.divider} />
                <Text style={styles.confirmLabel}>Services:</Text>
                {lastBooking.services.map((service: any) => (
                  <View key={service.id} style={styles.serviceRow}>
                    <Text style={styles.confirmValue}>{service.name}</Text>
                    <Text style={styles.confirmValue}>${service.price}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.button} 
                onPress={() => {
                  resetBooking();
                  setActiveTab('bookings');
                }}
              >
                <Text style={styles.buttonText}>View My Bookings</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, { backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.primary, marginTop: 12 }]} 
                onPress={resetBooking}
              >
                <Text style={[styles.buttonText, { color: COLORS.primary }]}>Book Another Appointment</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* App Bar */}
      <AppBar 
        title="Salon Booking"
        showBackButton={shouldShowBack()}
        onBackPress={handleBack}
      />

      {/* Main Content */}
      <ScrollView style={styles.content}>{renderTabContent()}</ScrollView>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
}
