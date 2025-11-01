import {
  ErrorToast,
  SuccessToast,
} from '@components/toastMessage/ToastMessages';
import { Routes } from '@constants/routes';
import { SvgProps } from 'react-native-svg';
import { ReactNode } from 'react';
import { Svgs } from '@assets/index';
import { StyleSheet, View } from 'react-native';
import { wp } from '@utilities/dimensions';
import { Text } from '@config/core-ui';
import { useSelector } from 'react-redux';
import { RootState } from '@config/store';

export const get_tab_icon = (
  iconName: SvgProps | ReactNode,
  focused: boolean,
) => {
  const Colors = useSelector((state: RootState) => state?.colors?.colors);
  switch (iconName) {
    case Routes.DashboardStack:
      return <Svgs.Dashboard color={focused ? Colors.white : Colors.c1} width={wp('5%')} height={wp('5%')}/>;
    case Routes.WatchStack:
      return <Svgs.Watch color={focused ? Colors.white : Colors.c1} width={wp('5%')} height={wp('5%')}/>;
    case Routes.MediaLibraryStack:
      return <Svgs.MediaLibrary color={focused ? Colors.white : Colors.c1} width={wp('5%')} height={wp('5%')}/>;
    case Routes.MoreStack:
      return <Svgs.More color={focused ? Colors.white : Colors.c1}  width={wp('5%')} height={wp('5%')}/>;
  }
};

export const TabBarIconLabel = ({
  focused,
  iconName,
  label,
}: {
  focused: boolean;
  iconName: string;
  label: any;
}) => {
  const Colors = useSelector((state: RootState) => state?.colors?.colors);
  return (
    <View style={styles.tabContainer}>
      {get_tab_icon(iconName, focused)}
      <Text
        style={[
          styles.label,
          {
            color: focused ? Colors.white : Colors.c1,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    alignItems: 'center',
    marginTop: wp('-6%'),
  },
  label: {
    fontSize: 10,
    width: wp('25%'),
    textAlign: 'center',
    marginTop: 8,
  },
});

export const handle_validation_toast = () => {
  ErrorToast('One or more field(s) are invalid.');
};

const defaultConfig = {
  enabledToasts: true,
  enabledSuccessToast: true,
  enabledFaidedToast: true,
};

export const handle_api_res = (
  res?: any,
  successCallback?: (data: any) => void,
  failedCallback?: (error: any) => void,
  config = defaultConfig,
) => {
  const actualConfig = { ...defaultConfig, ...config };
  const { error, data } = res || {};

  if (error) {
    if (actualConfig.enabledFaidedToast && actualConfig.enabledToasts) {
      // Extract and format the error message
      let errorMsg = 'Something went wrong. Please try again later.';
      let errorMsg2 = '';

      // Check for specific error message
      if (error?.data?.error) {
        errorMsg = error?.data?.error;
      } else if (error?.data?.message) {
        // If it's a string, just use it
        errorMsg = error?.data?.message;
      }

      errorMsg2 = error?.data?.message ?? '';

      // Show the error message in a toast
      ErrorToast(errorMsg, errorMsg2);
    }
    if (failedCallback) failedCallback(error);
  }

  if (data) {
    if (
      actualConfig.enabledSuccessToast &&
      actualConfig.enabledToasts &&
      data?.message
    ) {
      SuccessToast(data?.message);
    }
    if (successCallback) successCallback(data);
  }
};
