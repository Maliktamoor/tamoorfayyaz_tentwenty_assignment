import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Modal,
  StatusBar,
  Alert,
  ImageBackground,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@config/store';
import { Text, TouchableOpacity } from '@config/core-ui';
import { Svgs } from '@assets/index';
import { wp, hp } from '@utilities/dimensions';
import { FontFamily } from '@assets/fonts';
import {
  useGetMovieDetailsQuery,
  useGetMovieImagesQuery,
  useGetMovieVideosQuery,
} from './services/MovieApi';
import { imageBaseUrl } from '@config/services/baseUrl';
import { ErrorMessage } from '@components/errorMessage';
import { Loader } from '@components/index';
import { Button } from '@components/button';
import YoutubePlayer from 'react-native-youtube-iframe';
import Orientation from 'react-native-orientation-locker';
import { Routes } from '@constants/routes';

interface RouteParams {
  movieId: number;
}

const MovieDetails = () => {
  const Colors = useSelector((state: RootState) => state?.colors?.colors);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const route = useRoute();
  const playerRef = useRef(null);

  const { movieId } = (route.params as RouteParams) || {};

  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);

  const {
    data: movieDetails,
    isLoading,
    refetch: refetchMovieDetails,
    error,
  } = useGetMovieDetailsQuery(movieId, {
    skip: !movieId,
  });

  const { data: movieImages } = useGetMovieImagesQuery(movieId, {
    skip: !movieId,
  });

  const { data: movieVideos } = useGetMovieVideosQuery(movieId, {
    skip: !movieId,
  });

  const handleWatchTrailer = async () => {
    const trailer = movieVideos?.results?.find(
      (v: any) => v.site === 'YouTube' && v.type === 'Trailer',
    );

    if (trailer) {
      setVideoKey(trailer.key);
      setShowVideoPlayer(true);
      setPlaying(true);
      setTimeout(() => {
        Orientation.lockToLandscape();
      }, 400);
    } else {
      Alert.alert('Trailer not available!');
    }
  };

  const handleCloseVideo = () => {
    setShowVideoPlayer(false);
    setPlaying(false);
    setVideoKey(null);
    Orientation.lockToPortrait();
  };

  const onStateChange = (state: string) => {
    if (state === 'ended') {
      handleCloseVideo();
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <Loader size="small" color={Colors.secondary} />;
  }

  if (!movieDetails || error) {
    return (
      <ErrorMessage refetch={refetchMovieDetails} message="Movie not found" />
    );
  }

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
    ? `${imageBaseUrl.replace('/w500', '/w1280')}${file_path}`
    : undefined;

  return (
    <View style={[styles.container, { backgroundColor: Colors.white }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: hp('15%') + insets.bottom,
        }}
      >
        <ImageBackground
          source={backdropUri ? { uri: backdropUri } : undefined}
          //  style={{ width: screenWidth, height: imageHeight }}
          style={{ width: screenWidth, height: 530 }}
          resizeMode="cover"
        >
          <View style={styles.posterContainer}>
            <View
              style={[
                styles.header,
                {
                  paddingTop: insets.top,
                  paddingHorizontal: wp('5%'),
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10,
                }}
              >
                <Svgs.BackArrow
                  width={wp('5%')}
                  height={wp('5%')}
                  color={Colors.white}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color: Colors.white,
                  },
                ]}
              >
                Watch
              </Text>
            </View>
            <LinearGradient
              colors={[
                'transparent',
                'rgba(0, 0, 0, 0.5)',
                'rgba(0, 0, 0, 0.9)',
              ]}
              locations={[0, 0.6, 1]}
              style={styles.posterGradient}
            >
              <View style={styles.actionButtonsContainer}>
                {movieDetails.release_date && (
                  <Text
                    style={[
                      styles.releaseDate,
                      {
                        color: Colors.white,
                        fontFamily: FontFamily.regular,
                      },
                    ]}
                  >
                    In Theaters {formatDate(movieDetails.release_date)}
                  </Text>
                )}
                <Button
                  title="Get Tickets"
                  onPress={() => navigation.navigate(Routes.SeatMapping as never)}
                  textStyle={{
                    color: Colors.white,
                    fontFamily: FontFamily.bold,
                  }}
                  containerStyle={{
                    backgroundColor: Colors.secondary,
                  }}
                />
                <Button
                  title="Watch Trailer"
                  onPress={handleWatchTrailer}
                  transparent
                  textStyle={{
                    color: Colors.white,
                    fontFamily: FontFamily.bold,
                  }}
                  containerStyle={{
                    borderWidth: 1,
                    borderColor: Colors.white,
                  }}
                  icon={<Svgs.play width={wp('3%')} height={wp('3%')} />}
                />
              </View>
            </LinearGradient>
          </View>
        </ImageBackground>

        <View style={styles.contentSection}>
          {movieDetails.genres && movieDetails.genres.length > 0 && (
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: Colors.text,
                    fontFamily: FontFamily.bold,
                  },
                ]}
              >
                Genres
              </Text>
              <View style={styles.genreContainer}>
                {movieDetails.genres.map((genre: any, index: number) => {
                  const genreColors = [
                    Colors.c3,
                    Colors.c4,
                    Colors.c5,
                    Colors.c6,
                  ];
                  const colorIndex = index % genreColors.length;
                  return (
                    <View
                      key={genre.id}
                      style={[
                        styles.genreTag,
                        { backgroundColor: genreColors[colorIndex] },
                      ]}
                    >
                      <Text
                        style={[
                          styles.genreText,
                          {
                            color: Colors.white,
                            fontFamily: FontFamily.medium,
                          },
                        ]}
                      >
                        {genre.name}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {movieDetails.overview && (
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: Colors.text,
                    fontFamily: FontFamily.bold,
                  },
                ]}
              >
                Overview
              </Text>
              <Text
                style={[
                  styles.overviewText,
                  {
                    color: Colors.c1,
                    fontFamily: FontFamily.regular,
                  },
                ]}
              >
                {movieDetails.overview}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showVideoPlayer}
        animationType="fade"
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={handleCloseVideo}
      >
        <View style={styles.videoPlayerContainer}>
          <StatusBar hidden />

          <View
            style={[
              styles.videoHeader,
              {
                paddingTop: insets.top,
                paddingHorizontal: wp('5%'),
              },
            ]}
          ></View>

          {videoKey && (
            <View style={styles.videoPlayerWrapper}>
              <View style={{ flex: 1, backgroundColor: 'black' }}>
                <YoutubePlayer
                  ref={playerRef}
                  height={'100%'}
                  width={'100%'}
                  play={playing}
                  videoId={videoKey}
                  onChangeState={onStateChange}
                  forceAndroidAutoplay
                  initialPlayerParams={{
                    controls: true,
                    modestbranding: true,
                    preventFullScreen: true,
                  }}
                />

                <TouchableOpacity
                  onPress={handleCloseVideo}
                  style={styles.doneButton}
                >
                  <Text
                    style={[
                      styles.doneButtonText,
                      {
                        color: Colors.white,
                        fontFamily: FontFamily.bold,
                      },
                    ]}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    paddingVertical: hp('2%'),
    gap: wp('2%'),
    marginTop: hp('2%'),
  },
  headerTitle: {
    fontSize: wp('5%'),
  },
  posterContainer: {
    width: '100%',
    height: hp('60%'),
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  posterGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: 'flex-end',
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('5%'),
  },
  posterContent: {
    width: '100%',
  },
  movieTitle: {
    fontSize: wp('7%'),
    marginBottom: hp('1%'),
    letterSpacing: 0.5,
  },
  releaseDate: {
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  actionButtonsContainer: {
    gap: wp('3%'),
    marginTop: hp('2%'),
    marginHorizontal: wp('7%'),
  },
  getTicketsButton: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchTrailerButton: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: wp('2%'),
  },
  playIcon: {
    width: wp('6%'),
    height: wp('6%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: wp('1.5%'),
    borderRightWidth: 0,
    borderTopWidth: wp('1%'),
    borderBottomWidth: wp('1%'),
    borderLeftColor: '#000',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: wp('0.5%'),
  },
  buttonText: {
    fontSize: wp('4%'),
  },
  contentSection: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('3%'),
  },
  section: {
    marginBottom: hp('3%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    marginBottom: hp('2%'),
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('2%'),
  },
  genreTag: {
    borderRadius: wp('4%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: 2,
  },
  genreText: {
    fontSize: wp('3.5%'),
  },
  overviewText: {
    fontSize: wp('3.8%'),
    lineHeight: hp('2.5%'),
  },
  videoPlayerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: hp('2%'),
  },
  doneButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  doneButtonText: {
    fontSize: wp('4%'),
  },
  videoPlayerWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
});

export default MovieDetails;
