/**
 * Color configuration for Catfish Crasher app
 * Modify these values to change the app's color scheme
 */

export const colors = {
  // Primary brand color (light blue/cyan)
  primary: '#0AB4E0',
  
  // Background colors
  background: {
    dark: '#0E1F2B',        // Dark blue background
    logoBox: 'rgba(10, 180, 224, 0.2)', // 20% opacity primary color
  },
  
  // Text colors
  text: {
    primary: '#0AB4E0',    // Brand text (CATFISH, CRASHER)
    white: '#FFFFFF',       // Welcome text and tagline
    secondary: '#A0B4C8',
    black: '#000000',  // Secondary text (placeholders, etc.)
    grey: '#99A1AF',
    text_bg: '#192D41',
    version_color: '#6A7282',
  },
  
  // Border colors
  border: {
    logoBox: '#0AB4E0',
  },
  
  // Additional colors from color scheme
  accent: {
    lightGreyBlue: '#A0B4C8', // Light grey-blue accent color
    yellow: '#FFD700', // Yellow for upgrade button
    green: '#4CAF50', // Green for success/real status
    gold: 'rgba(240, 177, 0, 1)', // Gold for upgrade card
    goldButton: '#F4D03F', // Brighter gold for upgrade button
    red: '#FF3B30', // Red for delete account
  },
  
  // Gradient configurations for LinearGradient
  gradients: {
    upgradeButton: {
      colors: ['#F0B100', '#D08700'], // Gold gradient from left to right
      start: { x: 0, y: 0 }, // Start position (left)
      end: { x: 1, y: 0 },   // End position (right)
    },
  },
};

// Export individual colors for convenience
export const {
  primary,
  background,
  text,
  border,
} = {
  primary: colors.primary,
  background: colors.background,
  text: colors.text,
  border: colors.border,
};

export default colors;

