import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import colors from '../colors';

const CameraIcon = () => (
  <Svg width="120" height="120" viewBox="0 0 120 120" fill="none">
    {/* Circular background with semi-transparent fill */}
    <Circle cx="60" cy="60" r="60" fill={colors.background.logoBox} />
    
    {/* Camera icon outline */}
    <Path
      d="M40 35H50L52 30H68L70 35H80C82.7614 35 85 37.2386 85 40V75C85 77.7614 82.7614 80 80 80H40C37.2386 80 35 77.7614 35 75V40C35 37.2386 37.2386 35 40 35Z"
      stroke={colors.primary}
      strokeWidth="3"
      fill="none"
    />
    
    {/* Camera lens circle */}
    <Circle cx="60" cy="57.5" r="12" stroke={colors.primary} strokeWidth="3" fill="none" />
    
    {/* Inner lens circle */}
    <Circle cx="60" cy="57.5" r="6" stroke={colors.primary} strokeWidth="2" fill="none" />
    
    {/* Flash indicator */}
    <Circle cx="70" cy="42" r="3" fill={colors.primary} />
  </Svg>
);

export default CameraIcon;

