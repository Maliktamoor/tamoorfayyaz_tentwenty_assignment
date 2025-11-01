import { Dimensions, Image, StyleProp, StyleSheet, View,ImageStyle } from 'react-native'
import React from 'react'
import { useGetMovieImagesQuery } from '@screens/app/watch/services/MovieApi';
import { imageBaseUrl } from '@config/services/baseUrl';
import { Images } from '@assets/images';

const GetImage = ({ movieId, imageType, imageStyle }: { movieId: number, imageType: 'poster' | 'backdrop', imageStyle?: StyleProp<ImageStyle> }) => {
  const { data: movieImages } = useGetMovieImagesQuery(movieId, {
    skip: !movieId,
  });

  const screenWidth = Dimensions.get('window').width;

  let bestBackdrop = null;
  if (movieImages?.backdrops?.length > 0) {
    bestBackdrop = [...movieImages.backdrops].sort(
      (a: any, b: any) => b.vote_average - a.vote_average,
    )[0];
  }

  const { file_path, aspect_ratio } = bestBackdrop || {};
  const imageHeight = screenWidth / (aspect_ratio || 1.778);

  const backdropUri = file_path
    ? `${imageBaseUrl.replace('/w500', imageType == 'poster' ? '/w500' : '/w1280')}${file_path}`
    : undefined;

  return <Image source={ backdropUri ? { uri: backdropUri } : Images.noImage}  style={ imageStyle?? { width: screenWidth, height: imageHeight }} resizeMode="cover" />;
};

export default GetImage;