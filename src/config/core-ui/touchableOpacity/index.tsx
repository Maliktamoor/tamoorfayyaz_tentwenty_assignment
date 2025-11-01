import {GestureResponderEvent, TouchableOpacity as RNTouchableOpacity, ViewStyle} from 'react-native';
import React, {FC, ReactNode} from 'react';

interface TouchableOpacityTypes {
  onPress?: (event :GestureResponderEvent) => void;
  children: ReactNode;
  disabled?: boolean;
  style?: ViewStyle | any;
  activeOpacity?: number;
}

export const TouchableOpacity: FC<TouchableOpacityTypes> = ({onPress, children, disabled, style, activeOpacity}) => {
  return (
    <RNTouchableOpacity
      style={style}
      onPress={onPress}
      disabled={disabled}
      hitSlop={{right: 12, top: 12, left: 12, bottom: 12}}
      activeOpacity={activeOpacity ?? 0.8}>
      {children}
    </RNTouchableOpacity>
  );
};
