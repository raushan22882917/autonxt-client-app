import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';

export interface LoaderProps extends ActivityIndicatorProps {
  size?: number | 'small' | 'large';
}

export default function Loader({ size = 'small', color = '#ffffff', ...props }: LoaderProps) {
  return <ActivityIndicator size={size} color={color} {...props} />;
}
