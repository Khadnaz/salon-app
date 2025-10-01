/**
 * AppBar Component
 * 
 * A reusable navigation header component with optional back button
 * and right-side action button support.
 * 
 * Features:
 * - Centered title
 * - Optional back navigation arrow
 * - Customizable right section for action buttons
 * - Consistent styling with shadow and border
 * 
 * @module AppBar
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Props for the AppBar component
 */
interface AppBarProps {
  /** The title text to display in the center */
  title: string;
  /** Whether to show the back button (left arrow) */
  showBackButton?: boolean;
  /** Callback function when back button is pressed */
  onBackPress?: () => void;
  /** Optional custom component to display on the right side */
  rightButton?: React.ReactNode;
}

/**
 * AppBar Component
 * 
 * Renders a navigation header with title and optional navigation controls
 * 
 * @param {AppBarProps} props - Component properties
 * @returns {JSX.Element} The rendered app bar
 * 
 * @example
 * ```tsx
 * <AppBar 
 *   title="Salon Booking"
 *   showBackButton={true}
 *   onBackPress={() => navigate('home')}
 * />
 * ```
 */
export default function AppBar({ 
  title, 
  showBackButton = false, 
  onBackPress,
  rightButton 
}: AppBarProps) {
  return (
    <View style={styles.appBar}>
      {showBackButton && onBackPress ? (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      
      <Text style={styles.appBarTitle}>{title}</Text>
      
      <View style={styles.rightSection}>
        {rightButton || <View style={styles.placeholder} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    paddingRight: 10,
    paddingLeft: 5,
  },
  backButtonText: {
    color: '#666',
    fontSize: 32,
    fontWeight: '300',
  },
  rightSection: {
    minWidth: 50,
    alignItems: 'flex-end',
  },
  placeholder: {
    minWidth: 50,
  },
});
