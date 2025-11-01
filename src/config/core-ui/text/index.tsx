import {FC, ReactNode} from 'react';
import {Text as RNText, TextStyle} from 'react-native';
import { FontFamily } from '@assets/fonts';
import { wp } from '@utilities/dimensions';
import { useSelector } from 'react-redux';
import { RootState } from '@config/store';

interface TextTypes {
  style?: TextStyle | any;
  onPress?: () => void;
  children?: ReactNode;
  color?: string;
}

export const Text: FC<TextTypes> = ({style, color, onPress, children}) => {
  const Colors = useSelector((state: RootState) => state?.colors?.colors)
  return (
    <RNText
      style={[
        {
          color: color ? color : Colors.text,
          fontFamily: FontFamily.regular,
          fontSize:wp('3.4%')
        },
        style,
      ]}
      onPress={onPress}>
      {children}
    </RNText>
  );
};
