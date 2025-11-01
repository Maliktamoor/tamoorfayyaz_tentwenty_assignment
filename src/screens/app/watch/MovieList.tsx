import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@config/store';
import { Text, TouchableOpacity } from '@config/core-ui';
import { Svgs } from '@assets/index';
import { wp, hp } from '@utilities/dimensions';
import { Routes } from '@constants/routes';
import { FontFamily } from '@assets/fonts';
import { useGetMoviesListQuery } from './services/MovieApi';
import { imageBaseUrl } from '@config/services/baseUrl';
import { Loader, ModalLoader } from '@components/index';
import { ErrorMessage } from '@components/errorMessage';
import GetImage from '@components/getImage';

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  [key: string]: any;
}

const MovieList = () => {
  const Colors = useSelector((state: RootState) => state?.colors?.colors);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [page, setPage] = useState(1);
  const [allMovies, setAllMovies] = useState<TMDBMovie[]>([]);

  const {
    data: moviesListResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetMoviesListQuery(page);

  useEffect(() => {
    if (moviesListResponse) {
      setAllMovies(prevData =>
        page === 1
          ? moviesListResponse?.results
          : [...prevData, ...moviesListResponse?.results],
      );
    }
  }, [moviesListResponse]);

  const loadMoreMovies = () => {
    if (
      moviesListResponse?.page < moviesListResponse?.total_pages &&
      !isLoading
    ) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    refetch();
  };

  const handleSearchPress = () => {
    navigation.navigate(Routes.MovieSearch);
  };

  const renderMovieItem = ({ item }: { item: TMDBMovie }) => {
    return (
      <TouchableOpacity
        style={styles.movieCard}
        onPress={() =>
          navigation.navigate(Routes.MovieDetails, { movieId: item.id })
        }
      >
        <GetImage movieId={item.id} imageType="poster" />
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.9)']}
          locations={[0, 0.6, 1]}
          style={styles.titleOverlay}
        >
          <Text
            style={[
              styles.movieTitle,
              {
                color: Colors.white,
                fontFamily: FontFamily.bold,
              },
            ]}
          >
            {item.title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: Colors.white }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + hp('2%'),
            paddingHorizontal: wp('5%'),
          },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            {
              color: Colors.primary,
              fontFamily: FontFamily.semiBold,
            },
          ]}
        >
          Watch
        </Text>
        <TouchableOpacity onPress={handleSearchPress}>
          <Svgs.Search
            width={wp('15%')}
            height={wp('15%')}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ModalLoader visible={true} />
      ) : error ? (
        <ErrorMessage
          refetch={refetch}
          message="Failed to load movies. Please try again."
        />
      ) : (
        <View style={{ flex: 1, backgroundColor: Colors.c7 }}>
          <FlatList
            data={allMovies}
            renderItem={renderMovieItem}
            keyExtractor={(item, index) =>
              (item.id.toString() + index).toString()
            }
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: hp('15%') + insets.bottom },
            ]}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMoreMovies}
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={handleRefresh}
                colors={[Colors.secondary]}
                tintColor={Colors.secondary}
              />
            }
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetching ? (
                <View style={styles.footerLoader}>
                  <Loader size="small" color={Colors.secondary} />
                </View>
              ) : null
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: wp('5%'),
  },
  underline: {
    height: 3,
    width: wp('30%'),
    borderRadius: 2,
  },
  listContent: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
  },
  movieCard: {
    width: '100%',
    height: hp('25%'),
    borderRadius: wp('4%'),
    marginBottom: hp('2.5%'),
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('2%'),
    paddingTop: hp('4%'),
    justifyContent: 'flex-end',
  },
  movieTitle: {
    fontSize: wp('4.5%'),
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerLoader: {
    paddingVertical: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MovieList;
