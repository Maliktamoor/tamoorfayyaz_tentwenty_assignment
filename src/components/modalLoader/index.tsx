// components/ModalLoader.tsx
import React from 'react';
import { Modal, View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface ModalLoaderProps {
  visible: boolean;
  message?: string;
  transparent?: boolean;
}

export const ModalLoader: React.FC<ModalLoaderProps> = ({
  visible,
  message = 'Loading...',
  transparent = true,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // dim background
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    backgroundColor: '#333',
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  message: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
});
