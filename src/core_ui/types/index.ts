import {ReactNode} from 'react';
import {TextStyle, GestureResponderEvent,ViewStyle} from 'react-native';


interface TextTypes {
  style?: TextStyle | any;
  onPress?: () => void;
  children?: ReactNode;
  color?: string;
  numberOfLines?: number;
}

interface TouchableOpacityTypes {
  onPress?: (event :GestureResponderEvent | any) => void;
  children: ReactNode;
  disabled?: boolean;
  style?: ViewStyle | any;
  activeOpacity?: number;
}

export type {TextTypes, TouchableOpacityTypes};
