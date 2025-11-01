import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';

export const Loader = ({
  size,
  color,
}: {
  size: number | 'small' | 'large' | undefined;
  color: string;
}) => {
  return (
    <View>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({});
