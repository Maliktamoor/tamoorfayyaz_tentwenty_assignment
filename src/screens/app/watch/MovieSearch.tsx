import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Image,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@config/store';
import { Text, TouchableOpacity } from '@config/core-ui';
import { Images, Svgs } from '@assets/index';
import { wp, hp } from '@utilities/dimensions';
import { Routes } from '@constants/routes';
import { FontFamily } from '@assets/fonts';
import { useSearchMoviesQuery, useGetGenresQuery } from './services/MovieApi';
import { imageBaseUrl } from '@config/services/baseUrl';
import GetImage from '@components/getImage';

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  [key: string]: any;
}

interface Genre {
  id: number;
  name: string;
}

const MovieSearch = () => {
  const Colors = useSelector((state: RootState) => state?.colors?.colors);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const searchInputRef = useRef<TextInput>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const { data: genresData } = useGetGenresQuery();

  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
  } = useSearchMoviesQuery(
    { query: searchQuery },
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      Keyboard.dismiss();
      setShowResults(true);
    }
  };

  const handleBackPress = () => {
    setSearchQuery('');
    setShowResults(false);
    Keyboard.dismiss();
    searchInputRef.current?.blur();
  };

  const handleGenrePress = (genre: Genre) => {
    console.log('Genre pressed:', genre);
  };

  const renderGenreItem = ({ item }: { item: Genre }) => {
    return (
      <TouchableOpacity
        style={styles.genreCard}
        onPress={() => handleGenrePress(item)}
        activeOpacity={0.8}
      >
        <GetImage movieId={item.id} imageType="poster" />
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.8)']}
          locations={[0, 0.5, 1]}
          style={styles.genreOverlay}
        >
          <Text
            style={[
              styles.genreName,
              {
                color: Colors.white,
                fontFamily: FontFamily.bold,
              },
            ]}
          >
            {item.name}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const getGenreName = (id: number) => {
    const genre = genres.find((g: Genre) => g.id === id);
    return genre ? genre.name : 'Unknown';
  };

  const renderMovieItem = ({ item }: { item: TMDBMovie }) => {
    return (
      <TouchableOpacity
        style={styles.movieCard}
        onPress={() =>
          navigation.navigate(Routes.MovieDetails, { movieId: item.id })
        }
      >
        {/* <Image
          source={{
            uri: item.poster_path
              ? `${imageBaseUrl}${item.poster_path}`
              : 'https://via.placeholder.com/500x750?text=No+Image',
          }}
          style={styles.posterImage}
          resizeMode="cover"
        /> */}
        <GetImage movieId={item.id} imageType="poster" imageStyle={styles.posterImage} />
        <View style={styles.movieTitleContainer}>
          <Text
            style={[
              styles.movieTitle,
              {
                color: Colors.text,
                fontFamily: FontFamily.bold,
              },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[styles.genreName, { color: Colors.c2, fontSize: wp('3%') }]}
          >
            {getGenreName(item?.genre_ids?.[0])}
          </Text>
        </View>
        <View style={styles.menuIconContainer}>
          <Svgs.Menu />
        </View>
      </TouchableOpacity>
    );
  };

  const genres = genresData?.genres || [];
  const movies = searchResults?.results || [];
  const resultCount = searchResults?.total_results || 0;

  return (
    <View style={[styles.container, { backgroundColor: Colors.white }]}>
      <View
        style={[
          styles.searchContainer,
          {
            paddingTop: insets.top + hp('2%'),
            paddingHorizontal: wp('5%'),
          },
        ]}
      >
        {showResults && resultCount > 0 ? (
          <View style={styles.resultCountContainer}>
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}
            >
              <Svgs.BackArrow
                width={wp('5%')}
                height={wp('5%')}
                color={Colors.primary}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.resultCountText,
                {
                  color: Colors.text,
                  fontFamily: FontFamily.semiBold,
                },
              ]}
            >
              {resultCount} {resultCount === 1 ? 'Result' : 'Results'} Found
            </Text>
          </View>
        ) : (
          <View style={[styles.searchBar, { backgroundColor: Colors.c7 }]}>
            <View style={styles.searchIconContainer}>
              <Svgs.Search
                width={wp('10%')}
                height={wp('10%')}
                color={Colors.c1}
              />
            </View>

            <TextInput
              ref={searchInputRef}
              style={[
                styles.searchInput,
                {
                  color: Colors.text,
                  fontFamily: FontFamily.regular,
                },
              ]}
              placeholder="TV shows, movies and more"
              placeholderTextColor={Colors.c1}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              autoFocus={true}
            />

            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setShowResults(false);
                }}
                style={styles.clearButton}
              >
                <Text
                  style={[
                    styles.clearIcon,
                    {
                      color: Colors.c1,
                      fontFamily: FontFamily.bold,
                    },
                  ]}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      {!searchQuery.trim() ? (
        <FlatList
          key={'genres'}
          data={genres}
          renderItem={renderGenreItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={[
            styles.genreListContent,
            { paddingBottom: hp('15%') + insets.bottom },
          ]}
          columnWrapperStyle={styles.genreRow}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          key={'movies'}
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={[
            styles.movieListContent,
            {
              paddingBottom: hp('15%') + insets.bottom,
              backgroundColor: Colors.c7,
            },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => {
            return (
              <>
                {searchQuery.trim() && resultCount > 0 && !showResults && (
                  <View>
                    <Text style={[styles.headerTitle, { color: Colors.text }]}>
                      Top Results
                    </Text>
                    <View
                      style={[styles.underline, { backgroundColor: Colors.c2 }]}
                    />
                  </View>
                )}
              </>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingBottom: hp('2%'),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    minHeight: hp('6%'),
  },
  backButton: {},
  searchIconContainer: {},
  searchInput: {
    flex: 1,
    fontSize: wp('4%'),
    padding: 0,
    margin: 0,
  },
  clearButton: {
    padding: wp('1%'),
    marginLeft: wp('2%'),
  },
  clearIcon: {
    fontSize: wp('5%'),
    lineHeight: wp('5%'),
  },
  resultCountText: {
    fontSize: wp('3.5%'),
    marginTop: 3,
  },
  genreListContent: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
  },
  genreRow: {
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  genreCard: {
    width: '48%',
    height: hp('20%'),
    borderRadius: wp('4%'),
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
  genreImage: {
    width: '100%',
    height: '100%',
  },
  genreOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp('3%'),
    paddingBottom: hp('1.5%'),
    paddingTop: hp('4%'),
    justifyContent: 'flex-end',
  },
  genreName: {
    fontSize: wp('4%'),
    letterSpacing: 0.5,
  },
  movieListContent: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
  },
  movieCard: {
    borderRadius: wp('4%'),
    marginBottom: hp('2.5%'),
    overflow: 'hidden',
    flexDirection: 'row',
    // backgroundColor: 'red',
    gap: wp('2%'),
  },
  posterImage: {
    width: wp('40%'),
    height: hp('15%'),
    borderRadius: wp('4%'),
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
    fontSize: wp('3.5%'),
    letterSpacing: 0.5,
  },
  movieTitleContainer: {
    width: '42%',
    paddingTop: hp('1%'),
  },
  menuIconContainer: {
    paddingTop: hp('4%'),
  },
  headerTitle: {
    fontSize: wp('3.4%'),
    paddingTop: hp('2%'),
    fontFamily: FontFamily.semiBold,
  },
  underline: {
    height: 2,
    marginVertical: hp('1%'),
  },
  resultCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
    marginTop: hp('2%'),
  },
});

export default MovieSearch;
