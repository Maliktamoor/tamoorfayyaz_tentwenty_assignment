import { StyleSheet,View} from 'react-native';
import React from 'react';
import { RootState } from '@config/store';
import { useSelector } from 'react-redux';
import { ColorsTypes } from '@config/colors';
import { Svgs } from '@assets/index';
import { wp } from '@utilities/dimensions';

const StartUpScreen = () => {
  const Colors = useSelector((state:RootState) => state?.colors?.colors)
  const styles = createDynamicStyles(Colors);

  return (
    <View style={styles.Container}>
      <Svgs.Watch width={wp('30%')} height={wp('30%')} />
    </View>
  );
};

export default StartUpScreen;
const createDynamicStyles = (Colors: ColorsTypes) =>
  StyleSheet.create({
  Container: {
    backgroundColor: Colors.white,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Text: {
    color: Colors.black,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
