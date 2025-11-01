import { Alert, PermissionsAndroid, Platform } from 'react-native';
import {request, PERMISSIONS, RESULTS, check} from 'react-native-permissions';


export const checkCameraPermission = async () => {
    if (Platform.OS === 'ios') {
      const permission = PERMISSIONS.IOS.CAMERA;
      const status = await check(permission);
      return handlePermissionStatus(status, permission);
    } else {
      // Android permission handling
      return requestAndroidPermission(PermissionsAndroid.PERMISSIONS.CAMERA,'Camera');
    }
  };

  export const checkPhotoLibraryPermission = async () => {
    if (Platform.OS === 'ios') {
      const permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
      const status = await check(permission);
      return handlePermissionStatus(status, permission);
    } else {
      // Android permission handling
      return requestAndroidPermission(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,'Gallery'
      );
    }
  };


// Request Android permissions
const requestAndroidPermission = async (permission:any,label:any) => {
    try {
      const granted = await PermissionsAndroid.check(permission);
  
      if (granted) {
        return true
      } else {
        const granted = await PermissionsAndroid.request(permission, {
          title: `Corner Sign App ${label} Permission`,
          message:
            `Corner Sign App needs access to your ${label}  ` +
            `so you can take awesome pictures.`,
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
  
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          return false;
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Handle permission status for iOS
const handlePermissionStatus = async (status:any, permission:any) => {
    switch (status) {
      case RESULTS.UNAVAILABLE:
        Alert.alert('Feature not available on this device.');
        return false;
      case RESULTS.DENIED:
        const newStatus = await request(permission);
        return newStatus === RESULTS.GRANTED;
      case RESULTS.BLOCKED:
        Alert.alert(
          'Permission is blocked and not requestable. Go to settings to allow it.',
        );
        return false;
      case RESULTS.GRANTED:
      case RESULTS.LIMITED:
        return true;
      default:
        return false;
    }
  };
  