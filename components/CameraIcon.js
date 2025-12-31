import React from 'react';
import Svg, { Circle, Path, G } from 'react-native-svg';
import colors from '../colors';

const CameraIcon = () => (
  <Svg width="120" height="120" viewBox="0 0 120 120" fill="none">
    {/* Circular background with semi-transparent fill */}
    <Circle cx="60" cy="60" r="60" fill={colors.background.logoBox} />
    
    {/* Camera icon - scaled and centered */}
    <G transform="translate(36, 36) scale(1)">
      {/* Camera body */}
      <Path
        d="M28.999 7.99973H18.9993L13.9995 13.9995H7.99973C6.93891 13.9995 5.92153 14.4209 5.17141 15.171C4.42129 15.9212 3.99988 16.9385 3.99988 17.9994V35.9987C3.99988 37.0595 4.42129 38.0769 5.17141 38.827C5.92153 39.5772 6.93891 39.9986 7.99973 39.9986H39.9986C41.0594 39.9986 42.0768 39.5772 42.8269 38.827C43.577 38.0769 43.9984 37.0595 43.9984 35.9987V17.9994C43.9984 16.9385 43.577 15.9212 42.8269 15.171C42.0768 14.4209 41.0594 13.9995 39.9986 13.9995H33.9988L28.999 7.99973Z"
        stroke={colors.primary}
        strokeWidth="3.99986"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Camera lens circle */}
      <Path
        d="M23.9991 31.9988C27.3127 31.9988 29.9989 29.3126 29.9989 25.9991C29.9989 22.6855 27.3127 19.9993 23.9991 19.9993C20.6855 19.9993 17.9993 22.6855 17.9993 25.9991C17.9993 29.3126 20.6855 31.9988 23.9991 31.9988Z"
        stroke={colors.primary}
        strokeWidth="3.99986"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </G>
  </Svg>
);

export default CameraIcon;

