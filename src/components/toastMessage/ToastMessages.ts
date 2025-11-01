import { Platform, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

export const ErrorToast = (title: string, description?: string) => {
  return Toast.show({
    type: 'error',
    text1: title,
    text1Style: { fontSize: 14, marginBottom: 5 },
    text2Style: { color: 'black', fontSize: 14 },
    text2: description,
    position: 'top',
    topOffset: Platform.OS == 'ios' ? 55 : 20,
  });
};

export const SuccessToast = (title: string, description?: string) => {
  return Toast.show({
    type: 'success',
    text1: title,
    text2: description,
    position: 'top',
    text1Style: { fontSize: 14, marginBottom: 5 },
    topOffset: Platform.OS == 'ios' ? 55 : 15,
  });
};

const styles = StyleSheet.create({});
