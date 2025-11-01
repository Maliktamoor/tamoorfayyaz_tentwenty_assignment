import {TouchableOpacity as RNTouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import {TouchableOpacityTypes} from '../types';

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
