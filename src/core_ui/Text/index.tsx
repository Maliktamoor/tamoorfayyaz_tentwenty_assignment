
import {FC} from 'react';
import {Text as RNText} from 'react-native';
import {TextTypes} from '../types';
import { FontFamily } from '@assets/fonts';
import { useSelector } from 'react-redux';
import { RootState } from '@config/store';
import { wp } from '@utilities/dimensions';

export const Text: FC<TextTypes> = ({style, color, onPress, children,...props}) => {
  const Colors = useSelector((state:RootState) => state?.colors?.colors)

  return (
    <RNText
      style={[
        {
          color: color ? color : Colors.black,
          fontFamily: FontFamily.regular,
          fontSize:wp('3.4%')
        },
        style,
      ]}
      onPress={onPress}
      {...props}
      >
      {children}
    </RNText>
  );
};
