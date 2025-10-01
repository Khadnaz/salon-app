/**
 * BottomNav Component
 * 
 * A fixed bottom navigation bar with tab-based navigation.
 * Provides quick access to main app sections: Home, Bookings, and Profile.
 * 
 * Features:
 * - Icon + label for each tab
 * - Visual feedback for active tab (highlighted color and bold text)
 * - Touch-responsive tab switching
 * - Consistent styling with shadow and border
 * 
 * @module BottomNav
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Available navigation tabs
 */
export type TabType = 'home' | 'bookings' | 'profile';

/**
 * Props for the BottomNav component
 */
interface BottomNavProps {
  /** Currently active tab */
  activeTab: TabType;
  /** Callback function when a tab is selected */
  onTabChange: (tab: TabType) => void;
}

/**
 * BottomNav Component
 * 
 * Renders a bottom navigation bar with three tabs
 * 
 * @param {BottomNavProps} props - Component properties
 * @returns {JSX.Element} The rendered bottom navigation
 * 
 * @example
 * ```tsx
 * <BottomNav 
 *   activeTab="home"
 *   onTabChange={(tab) => setActiveTab(tab)}
 * />
 * ```
 */
export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  /**
   * Tab configuration with icons and labels
   */
  const tabs = [
    { id: 'home' as TabType, icon: '🏠', label: 'Home' },
    { id: 'bookings' as TabType, icon: '📅', label: 'Bookings' },
    { id: 'profile' as TabType, icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={styles.navItem}
          onPress={() => onTabChange(tab.id)}
        >
          <Text style={[
            styles.navIcon,
            activeTab === tab.id && styles.navIconActive
          ]}>
            {tab.icon}
          </Text>
          <Text style={[
            styles.navLabel,
            activeTab === tab.id && styles.navLabelActive
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
    paddingBottom: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 12,
    color: '#666',
  },
  navLabelActive: {
    color: '#FF9500',
    fontWeight: 'bold',
  },
});
