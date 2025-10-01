/**
 * Styles for Salon Booking Application
 * 
 * Comprehensive stylesheet for the booking application using React Native StyleSheet API.
 * All styles use centralized design tokens from theme.ts for consistency.
 * 
 * Organization:
 * - Main Container & Layout: Base app structure
 * - Login/Signup Screens: Authentication UI
 * - Booking Flow Steps: Salon, service, staff, schedule selection
 * - Cards & Items: Reusable card components
 * - Buttons: Primary, secondary, and action buttons
 * - Tab Navigation: Bottom navigation and tab content
 * - Profile & Bookings: User-specific screens
 * - Success State: Confirmation screens
 * 
 * @module booking.styles
 */

import { StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from './theme';

/**
 * Complete stylesheet for the salon booking application
 * Uses design tokens for maintainable, consistent styling
 */
export const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Login Screen Styles
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxl,
  },
  loginTitle: {
    fontSize: FONT_SIZES.display,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.sm,
    color: COLORS.primary,
  },
  loginSubtitle: {
    fontSize: FONT_SIZES.lg,
    textAlign: 'center',
    marginBottom: SPACING.xxxl,
    color: COLORS.textSecondary,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: FONT_SIZES.lg,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  switchAuthButton: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    alignItems: 'center',
  },
  switchAuthText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  demoBox: {
    marginTop: SPACING.xxxl,
    padding: SPACING.lg,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.sm,
  },
  demoText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  // Header Styles (unused but kept for reference)
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl + 4,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  logoutBtn: {
    padding: SPACING.sm,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
  },

  // Content & Step Styles
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  stepContainer: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
  stepTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
    marginTop: 0,
    paddingHorizontal: SPACING.lg,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },

  // Card Styles
  card: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  cardSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  cardRating: {
    fontSize: FONT_SIZES.md,
    color: COLORS.warning,
    marginTop: SPACING.xs,
  },
  cardPrice: {
    fontSize: FONT_SIZES.md,
    color: COLORS.success,
    fontWeight: 'bold',
  },

  // Service Selection Styles
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkMark: {
    fontSize: 24,
    color: COLORS.primary,
  },
  totalBox: {
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginVertical: SPACING.md,
    marginHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  totalText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  // Button Styles
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginHorizontal: SPACING.lg,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },

  // Staff Selection Styles
  staffRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staffPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: SPACING.md,
  },
  staffInfo: {
    flex: 1,
  },

  // Schedule Selection Styles
  scheduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  timeSlot: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    minWidth: '30%',
    alignItems: 'center',
  },
  timeSlotDisabled: {
    backgroundColor: COLORS.background,
    opacity: 0.5,
  },
  timeSlotSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  timeText: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
  timeTextDisabled: {
    color: COLORS.textMuted,
  },
  unavailableText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },

  // Confirmation Screen Styles
  confirmCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  confirmLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  confirmValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.md,
  },
  totalLabel: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  confirmButton: {
    backgroundColor: COLORS.success,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },

  // Tab Content Styles
  tabContent: {
    paddingTop: SPACING.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textMuted,
  },

  // Profile Screen Styles
  profileCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  profileValue: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    marginTop: SPACING.xxl,
    marginHorizontal: SPACING.lg,
  },

  // Success Screen Styles
  successContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  successIcon: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  successTitle: {
    fontSize: FONT_SIZES.display,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxl,
    textAlign: 'center',
  },
  bookingIdLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  bookingId: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
});
