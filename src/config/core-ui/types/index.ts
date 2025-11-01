import {ReactNode} from 'react';
import {TextStyle, GestureResponderEvent,ViewStyle} from 'react-native';


interface TextTypes {
  style?: TextStyle;
  onPress?: () => void;
  children?: ReactNode;
  color?: string;
}

interface TouchableOpacityTypes {
  onPress?: (event :GestureResponderEvent) => void;
  children: ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  activeOpacity?: number;
}

export type {TextTypes, TouchableOpacityTypes};
