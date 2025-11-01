import {
  Animated,
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Image,
} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from '@constants/routes';
import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@config/store';
import { TabBarIconLabel } from '@utilities/helper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { wp } from '@utilities/dimensions';
import { Dashboared } from '@screens/app/dashboard';
import {
  MovieList,
  MovieDetails,
  MovieSearch,
  SeatMapping,
  SlotBooking,
} from '@screens/app/watch';
import { MediaLibrary } from '@screens/app/mediaLibrary';
import { More } from '@screens/app/more';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const DashboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name={Routes.Dashboard} component={Dashboared} />
    </Stack.Navigator>
  );
};

export const WatchStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name={Routes.MovieList} component={MovieList} />
      <Stack.Screen name={Routes.MovieDetails} component={MovieDetails} />
      <Stack.Screen name={Routes.MovieSearch} component={MovieSearch} />
      <Stack.Screen name={Routes.SeatMapping} component={SeatMapping} />
      <Stack.Screen name={Routes.SlotBooking} component={SlotBooking} />
    </Stack.Navigator>
  );
};

export const MediaLibraryStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name={Routes.MediaLibrary} component={MediaLibrary} />
    </Stack.Navigator>
  );
};

export const MoreStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name={Routes.More} component={More} />
    </Stack.Navigator>
  );
};

export const TabStack = () => {
  const Colors = useSelector((state: RootState) => state?.colors?.colors);
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName={Routes.WatchStack}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: Colors.primary,
            paddingBottom: insets.bottom,
            height: 75 + insets.bottom,
            paddingTop:wp('3%'),
            borderTopLeftRadius:30,
            borderTopRightRadius:30,
            borderWidth:0
            
          },
        }}
      >
       
        <Tab.Screen
          name={Routes.DashboardStack}
          component={DashboardStack}
          options={() => ({
            title: 'Dashboard',
            tabBarLabelStyle: styles.tabLabel,
            tabBarIcon: ({ color, focused }) => {
              return null;
            },
            tabBarLabel: ({ focused }) => {
              return (
                <TabBarIconLabel
                  focused={focused}
                  iconName={Routes.DashboardStack}
                  label={'Dashboard'}
                />
              );
            },
          })}
        />
         <Tab.Screen
          name={Routes.WatchStack}
          component={WatchStack}
          options={() => ({
            title: 'Watch',
            tabBarLabelStyle: styles.tabLabel,
            tabBarIcon: ({ color, focused }) => {
              return null;
            },
            tabBarLabel: ({ focused }) => {
              return (
                <TabBarIconLabel
                  focused={focused}
                  iconName={Routes.WatchStack}
                  label={'Watch'}
                />
              );
            },
          })}
        />
        <Tab.Screen
          name={Routes.MediaLibraryStack}
          component={MediaLibraryStack}
          options={() => ({
            title: 'Media Library',
            tabBarLabelStyle: styles.tabLabel,
            tabBarIcon: ({ color, focused }) => {
              return null;
            },
            tabBarLabel: ({ focused }) => {
              return (
                <TabBarIconLabel
                  focused={focused}
                  iconName={Routes.MediaLibraryStack}
                  label={'Media Library'}
                />
              );
            },
          })}
        />
        <Tab.Screen
          name={Routes.MoreStack}
          component={MoreStack}
          options={() => ({
            title: 'More',
            tabBarLabelStyle: styles.tabLabel,
            tabBarIcon: ({ color, focused }) => {
              return null;
            },
            tabBarLabel: ({ focused }) => {
              return (
                <TabBarIconLabel
                  focused={focused}
                  iconName={Routes.MoreStack}
                  label={'More'}
                />
              );
            },
          })}
        />
      </Tab.Navigator>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabLabel: {
    fontWeight: 'bold',
    justifyContent: 'center',
  },
});
