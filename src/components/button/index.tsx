import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  DimensionValue,
  TextStyle,
  View,
} from 'react-native';
import React from 'react';
import { wp } from '@utilities/dimensions';
import { FontFamily } from '@assets/fonts';
import { useSelector } from 'react-redux';
import { RootState } from '@config/store';
import { Loader } from '@components/index';
import { ColorsTypes } from '@config/colors';
import { Text } from '@core_ui/Text';

// Define prop types
interface ButtonProps {
  title: string;
  onPress?: () => void;
  textStyle?: TextStyle;
  loading?: boolean;
  containerStyle?: ViewStyle | ViewStyle[];
  transparent?: boolean;
  width?: DimensionValue;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  textStyle,
  loading = false,
  containerStyle,
  transparent = false,
  width,
  icon,
}) => {
  const Colors = useSelector((state: RootState) => state?.colors?.colors);
  const styles = createDynamicStyles(Colors);

  return (
    <>
      {transparent ? (
        <TouchableOpacity
          style={[
            styles.ContainerTransparent,
            {
              width: width ? width : '100%',
            },
            containerStyle,
          ]}
          onPress={onPress}
          disabled={loading}
        >
          {loading ? (
            <Loader size={'small'} color={Colors.primary} />
          ) : (
            // <Text style={[styles.titleTransparent, textStyle]}>{title}</Text>
            <View style={styles.innerCon}>
              {icon}
              <Text style={[styles.titleTransparent, textStyle]}>{title}</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          disabled={loading}
          style={[
            styles.Container,
            {
              width: width ? width : '100%',
            },
            containerStyle,
          ]}
        >
          {loading ? (
            <ActivityIndicator size={'small'} color={Colors.white} />
          ) : (
            <View style={styles.innerCon}>
              {icon}
              <Text style={[styles.title, textStyle]}>{title}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </>
  );
};

const createDynamicStyles = (Colors: ColorsTypes) =>
  StyleSheet.create({
    Container: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: wp('2%'),
      alignSelf: 'center',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
      paddingVertical: wp('4%'),
      backgroundColor: Colors.primary,
    },
    title: {
      fontSize: wp('4%'),
      fontFamily: FontFamily.bold,
      color: Colors.black,
    },
    ContainerTransparent: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: wp('1.2%'),
      alignSelf: 'center',
      borderWidth: 1,
      paddingVertical: wp('4%'),
    },
    titleTransparent: {
      fontSize: wp('4%'),
      fontFamily: FontFamily.regular,
      fontWeight: 'bold',
    },
    innerCon: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
    },
  });
