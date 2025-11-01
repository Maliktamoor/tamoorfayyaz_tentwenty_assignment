import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Text, TouchableOpacity } from '@config/core-ui'
import { useSelector } from 'react-redux'
import { RootState } from '@config/store'
import { FontFamily } from '@assets/fonts'
import { hp, wp } from '@utilities/dimensions'


export const ErrorMessage = ({ refetch, message }: { refetch: () => void, message: string }) => {
  const Colors = useSelector((state: RootState) => state?.colors?.colors);
  return (
    <View style={styles.errorContainer}>
    <Text
      style={[
        styles.errorText,
        {
          color: Colors.c1,
        },
      ]}>
      {message}
    </Text>
    <TouchableOpacity
      onPress={() => refetch()}
      style={StyleSheet.flatten([
        styles.retryButton,
        { backgroundColor: Colors.secondary },
      ])}>
      <Text
        style={[
          styles.retryButtonText,
          {
            color: Colors.white,
          },
        ]}>
        Retry
      </Text>
    </TouchableOpacity>
  </View>
  )
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp('5%'),
      },
      errorText: {
        fontSize: wp('4%'),
        textAlign: 'center',
        marginBottom: hp('3%'),
      },
      retryButton: {
        paddingHorizontal: wp('6%'),
        paddingVertical: hp('1.5%'),
        borderRadius: wp('2%'),
      },
      retryButtonText: {
        fontSize: wp('3.8%'),
        fontFamily: FontFamily.bold,
      },
})