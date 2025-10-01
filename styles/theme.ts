/**
 * App Theme Configuration
 * 
 * Centralized design tokens for consistent styling across the application.
 * Includes color palette, spacing scale, border radius values, and font sizes.
 * 
 * Usage:
 * Import specific constants as needed:
 * ```tsx
 * import { COLORS, SPACING } from '../styles/theme';
 * 
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: COLORS.background,
 *     padding: SPACING.lg,
 *   }
 * });
 * ```
 * 
 * @module theme
 */

/**
 * Color Palette
 * All colors used throughout the application
 */
export const COLORS = {
  // Primary Colors
  primary: '#FF9500',
  primaryLight: '#FFF4E6',
  
  // Neutral Colors
  white: '#fff',
  black: '#000',
  background: '#f5f5f5',
  
  // Text Colors
  textPrimary: '#333',
  textSecondary: '#666',
  textMuted: '#999',
  
  // Border Colors
  border: '#e0e0e0',
  borderLight: '#ddd',
  
  // Status Colors
  success: '#4caf50',
  error: '#dc2626',
  warning: '#ff9800',
};

/**
 * Spacing Scale
 * Consistent spacing values for margins, padding, and gaps
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

/**
 * Border Radius Values
 * Standardized corner radius for cards, buttons, and inputs
 */
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
};

/**
 * Font Size Scale
 * Typography sizes for consistent text hierarchy
 */
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 22,
  display: 32,
};
