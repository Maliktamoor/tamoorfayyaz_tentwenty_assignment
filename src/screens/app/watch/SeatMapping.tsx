import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@config/store';
import { Text, TouchableOpacity } from '@config/core-ui';
import { Svgs } from '@assets/index';
import { wp, hp } from '@utilities/dimensions';
import { FontFamily } from '@assets/fonts';
import { Button } from '@components/button';
import { Routes } from '@constants/routes';

interface RouteParams {
  movieId?: number;
  movieTitle?: string;
  releaseDate?: string;
}

interface Showtime {
  id: string;
  time: string;
  cinema: string;
  hall: string;
  price: number;
  bonus: number;
  seats: {
    available: number;
    total: number;
    layout: number[][]; // 0 = empty/aisle, 1 = available (gray), 2 = available (blue), 3 = premium, 4 = reserved, 5 = selected
  };
}

const mockShowtimes: Showtime[] = [
  {
    id: '1',
    time: '12:30',
    cinema: 'Cinetech',
    hall: 'Hall 1',
    price: 50,
    bonus: 2500,
    seats: {
      available: 45,
      total: 60,
      layout: [
        [
          0, 0, 0, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 0,
          0, 0,
        ],
        [
          0, 2, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 2,
          1, 0,
        ],
        [
          0, 1, 2, 1, 1, 3, 3, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 3, 3, 1, 1, 2,
          1, 0,
        ],
        [
          0, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1,
          1, 0,
        ],
        [
          1, 2, 2, 1, 1, 4, 4, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 4, 4, 1, 1, 1,
          1, 1,
        ],
        [
          1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 2, 2,
          1, 1,
        ],
        [
          1, 1, 3, 1, 1, 1, 1, 3, 3, 1, 1, 2, 2, 1, 1, 3, 3, 1, 1, 1, 2, 3, 1,
          1, 1,
        ],
        [
          1, 2, 3, 1, 1, 1, 1, 3, 3, 1, 1, 2, 2, 1, 1, 3, 3, 1, 1, 1, 2, 3, 1,
          1, 1,
        ],
        [
          1, 3, 2, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1,
          1, 1,
        ],
        [
          1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1,
          1, 1,
        ],
        [
          2, 2, 1, 1, 1, 2, 3, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 1, 2, 2, 1, 1, 2,
          2, 1,
        ],
        [
          1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1,
          1, 1,
        ],
        [
          1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1,
          1, 1,
        ],
        [
          0, 1, 3, 3, 0, 0, 1, 3, 3, 0, 0, 0, 0, 0, 1, 3, 3, 0, 0, 0, 0, 1, 3,
          3, 0,
        ],
      ],
    },
  },
  {
    id: '2',
    time: '13:30',
    cinema: 'Cinetech',
    hall: 'Hall 2',
    price: 75,
    bonus: 3000,
    seats: {
      available: 38,
      total: 60,
      layout: [
        [
          0, 0, 0, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 0,
          0, 0,
        ],
        [
          0, 2, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 2,
          1, 0,
        ],
        [
          0, 1, 2, 1, 1, 3, 3, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 3, 3, 1, 1, 2,
          1, 0,
        ],
        [
          0, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1,
          1, 0,
        ],
        [
          1, 2, 2, 1, 1, 4, 4, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 4, 4, 1, 1, 1,
          1, 1,
        ],
        [
          1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 2, 2,
          1, 1,
        ],
        [
          1, 1, 3, 1, 1, 1, 1, 3, 3, 1, 1, 2, 2, 1, 1, 3, 3, 1, 1, 1, 2, 3, 1,
          1, 1,
        ],
        [
          1, 2, 3, 1, 1, 1, 1, 3, 3, 1, 1, 2, 2, 1, 1, 3, 3, 1, 1, 1, 2, 3, 1,
          1, 1,
        ],
        [
          1, 3, 2, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1,
          1, 1,
        ],
        [
          1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1,
          1, 1,
        ],
        [
          2, 2, 1, 1, 1, 2, 3, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 1, 2, 2, 1, 1, 2,
          2, 1,
        ],
        [
          1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1,
          1, 1,
        ],
        [
          1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1,
          1, 1,
        ],
        [
          0, 1, 3, 3, 0, 0, 1, 3, 3, 0, 0, 0, 0, 0, 1, 3, 3, 0, 0, 0, 0, 1, 3,
          3, 0,
        ],
      ],
    },
  },
  {
    id: '3',
    time: '15:00',
    cinema: 'Cinetech',
    hall: 'Hall 3',
    price: 60,
    bonus: 2800,
    seats: {
      available: 52,
      total: 60,
      layout: [
        [
          0, 0, 0, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 0,
          0, 0,
        ],
        [
          0, 2, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 2,
          1, 0,
        ],
        [
          0, 1, 2, 1, 1, 3, 3, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 3, 3, 1, 1, 2,
          1, 0,
        ],
        [
          0, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1,
          1, 0,
        ],
        [
          1, 2, 2, 1, 1, 4, 4, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 4, 4, 1, 1, 1,
          1, 1,
        ],
        [
          1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 2, 2,
          1, 1,
        ],
        [
          1, 1, 3, 1, 1, 1, 1, 3, 3, 1, 1, 2, 2, 1, 1, 3, 3, 1, 1, 1, 2, 3, 1,
          1, 1,
        ],
        [
          1, 2, 3, 1, 1, 1, 1, 3, 3, 1, 1, 2, 2, 1, 1, 3, 3, 1, 1, 1, 2, 3, 1,
          1, 1,
        ],
        [
          1, 3, 2, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1,
          1, 1,
        ],
        [
          1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1,
          1, 1,
        ],
        [
          2, 2, 1, 1, 1, 2, 3, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 1, 2, 2, 1, 1, 2,
          2, 1,
        ],
        [
          1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1,
          1, 1,
        ],
        [
          1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1,
          1, 1,
        ],
        [
          0, 1, 3, 3, 0, 0, 1, 3, 3, 0, 0, 0, 0, 0, 1, 3, 3, 0, 0, 0, 0, 1, 3,
          3, 0,
        ],
      ],
    },
  },
];

const SeatMapping = () => {
  const Colors = useSelector((state: RootState) => state?.colors?.colors);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  const [showFullSeatMap, setShowFullSeatMap] = useState(false);

  const routeParams = route.params as RouteParams;
  const movieTitle = routeParams?.movieTitle || "The King's Man";
  const releaseDate = routeParams?.releaseDate || 'December 22, 2021';

  const dates = useMemo(() => {
    const dateArray = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dateArray.push(date);
    }
    return dateArray;
  }, []);

  useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(formatDateShort(dates[0]));
    }
  }, [dates]);

  const formatDateShort = (date: Date): string => {
    return `${date.getDate()} ${getMonthShort(date.getMonth())}`;
  };

  const getMonthShort = (month: number): string => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[month];
  };

  const renderSeatMap = (layout: number[][], index: number) => {
    return (
      <View key={index} style={styles.seatMapContainer}>
        {layout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((seat, seatIndex) => (
              <>
                <View
                  key={seatIndex}
                  style={[
                    styles.seat,
                    {
                      backgroundColor:
                        seat === 1
                          ? Colors.c2
                          : seat === 2
                          ? Colors.secondary
                          : seat === 3
                          ? Colors.c3
                          : seat === 4
                          ? Colors.c4
                          : 'transparent',
                      marginRight: seatIndex == 4 || seatIndex == 19 ? 10 : 0,
                    },
                  ]}
                />
              </>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderShowtimeCard = (showtime: Showtime, index: number) => {
    const isSelected = selectedShowtime === showtime.id;

    return (
      <View key={index}>
        <View style={styles.showtimeCardHeader}>
          <Text
            style={[
              styles.showtimeText,
              {
                color: Colors.text,
              },
            ]}
          >
            {showtime.time}
          </Text>
          <Text
            style={[
              styles.cinemaText,
              {
                color: Colors.c1,
                fontFamily: FontFamily.regular,
              },
            ]}
          >
            {showtime.cinema} {showtime.hall && `+ ${showtime.hall}`}
          </Text>
        </View>
        <TouchableOpacity
          key={showtime.id}
          style={[
            styles.showtimeCard,
            { borderColor: Colors.c2 },
            isSelected && { borderColor: Colors.secondary, borderWidth: 2 },
          ]}
          onPress={() =>setSelectedShowtime(showtime.id)}
          activeOpacity={0.7}
        >
          <View style={styles.seatMapPreview}>
            {renderSeatMap(showtime.seats.layout, index)}
            <View style={styles.titleOverlay}>
              <Svgs.cruve />
            </View>
          </View>
        </TouchableOpacity>
        <Text
          style={[
            styles.priceText,
            {
              color: Colors.text,
            },
          ]}
        >
          From{' '}
          <Text style={{ fontFamily: FontFamily.bold }}>{showtime.price}$</Text>{' '}
          or{' '}
          <Text style={{ fontFamily: FontFamily.bold }}>
            {showtime.bonus} bonus
          </Text>
        </Text>
      </View>
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Svgs.BackArrow
            width={wp('6%')}
            height={wp('6%')}
            color={Colors.text}
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text
            style={[
              styles.movieTitle,
              {
                color: Colors.text,
                fontFamily: FontFamily.bold,
              },
            ]}
          >
            {movieTitle}
          </Text>
          <Text
            style={[
              styles.releaseDate,
              {
                color: Colors.secondary,
                fontFamily: FontFamily.regular,
              },
            ]}
          >
            In Theaters {releaseDate}
          </Text>
        </View>
        <View style={{ width: wp('6%') }} />
      </View>
      <View style={{ backgroundColor: Colors.c7 }}>
        <View style={[styles.dateSection]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: Colors.text,
              },
            ]}
          >
            Date
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateScrollContent}
          >
            {dates.map((date, index) => {
              const dateStr = formatDateShort(date);
              const isSelected = selectedDate === dateStr;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateButton,
                    isSelected && {
                      backgroundColor: Colors.secondary,
                    },
                    !isSelected && {
                      backgroundColor: '#A6A6A61A',
                    },
                  ]}
                  onPress={() => setSelectedDate(dateStr)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dateButtonText,
                      {
                        color: isSelected ? Colors.white : Colors.text,
                        fontFamily: FontFamily.medium,
                      },
                    ]}
                  >
                    {dateStr}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.showtimesContent,
            { paddingBottom: hp('10%') + insets.bottom },
          ]}
        >
          {mockShowtimes.map((showtime, index) => renderShowtimeCard(showtime, index))}
        </ScrollView>

        <View style={[styles.bottomButtonContainer]}>
          <Button
            title="Select Seats"
            onPress={() => {
              navigation.navigate(Routes.SlotBooking as never)
            }}
            containerStyle={{
              backgroundColor: Colors.secondary,
            }}
            textStyle={{
              color: Colors.white,
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  headerCenter: {
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  movieTitle: {
    fontSize: wp('5%'),
    textAlign: 'center',
  },
  releaseDate: {
    fontSize: wp('3.5%'),
    textAlign: 'center',
  },
  dateSection: {
    paddingHorizontal: wp('5%'),
    marginBottom: hp('3%'),
    marginTop: hp('4%'),
    paddingVertical: hp('2%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    marginBottom: hp('2%'),
  },
  dateScrollContent: {
    gap: wp('3%'),
    paddingRight: wp('5%'),
  },
  dateButton: {
    paddingHorizontal: wp('5%'),
    paddingVertical: 5,
    borderRadius: wp('3%'),
    minWidth: wp('15%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: wp('3.8%'),
  },
  showtimesContent: {
    paddingHorizontal: wp('5%'),
    gap: wp('4%'),
  },
  showtimeCard: {
    width: wp('70%'),
    borderRadius: wp('4%'),
    padding: wp('1%'),
    marginRight: wp('3%'),
    borderWidth: 1,
  },
  showtimeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
    marginLeft: wp('2%'),
  },
  showtimeText: {
    fontSize: wp('4%'),
  },
  cinemaText: {
    fontSize: wp('3.5%'),
  },
  seatMapPreview: {
    height: hp('25%'),
    borderRadius: wp('2%'),
    backgroundColor: '#FFFFFF',
  },
  // seatMapContainer: {
  //   padding: 10,
  // },
  screenIndicator: {
    width: '60%',
    height: hp('1%'),
    marginBottom: hp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenCurve: {
    width: '100%',
    height: 2,
    borderRadius: 2,
  },
  seatsGrid: {
    width: '100%',
    flexWrap: 'wrap',
  },
  seatRow: {
    flexDirection: 'row',
    marginBottom: wp('1%'),
    marginRight: 2,
  },
  // seat: {
  //   width: wp('2%'),
  //   height: wp('2%'),
  //   borderRadius: wp('0.6%'),
  //   marginRight: 3,
  //   marginBottom: 4,
  // },
  seat2: {
    width: wp('2%'),
    height: wp('1%'),
    borderRadius: wp('0.4%'),
    marginTop: 1,
    alignSelf: 'center',
  },
  emptySeat: {
    width: wp('2.5%'),
    height: wp('2.5%'),
    marginHorizontal: wp('0.3%'),
  },
  priceText: {
    fontSize: wp('3.2%'),
    marginLeft: wp('2%'),
    marginTop: hp('1%'),
  },
  bottomButtonContainer: {
    paddingHorizontal: wp('5%'),
  },
  backButtonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  fullSeatMapContainer: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('25%'),
  },
  cinemaHallBox: {
    borderRadius: wp('4%'),
    borderWidth: 2,
    padding: wp('4%'),
    minHeight: hp('60%'),
  },
  screenContainer: {
    alignItems: 'center',
    marginBottom: hp('2%'),
    paddingHorizontal: wp('10%'),
  },
  screenCurveFull: {
    width: '100%',
    height: wp('1%'),
    borderRadius: wp('0.5%'),
  },
  screenText: {
    fontSize: wp('3%'),
    marginTop: hp('0.5%'),
  },
  seatMapScrollView: {},
  seatMapScrollContent: {
    paddingVertical: hp('2%'),
  },
  cinemaHall: {
    alignItems: 'center',
    width: '100%',
  },
  seatRowFull: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: wp('1.5%'),
    gap: wp('1%'),
    flexWrap: 'wrap',
  },
  aisleSpace: {
    height: wp('4%'),
  },
  seatFull: {
    width: wp('4%'),
    height: wp('4%'),
    borderRadius: wp('1%'),
    marginHorizontal: wp('0.5%'),
    borderWidth: 1,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp('4%'),
    paddingVertical: hp('2%'),
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  legendColor: {
    width: wp('4%'),
    height: wp('4%'),
    borderRadius: wp('0.8%'),
    borderWidth: 1,
  },
  legendText: {
    fontSize: wp('3%'),
    fontFamily: FontFamily.regular,
  },

  seatMapContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 2,
  },
  seat: {
    width: 5,
    height: 5,
    margin: 2,
    borderRadius: 1,
  },
  titleOverlay: {
    position: 'absolute',
    top: 6,
    left: 60,
    right: 0,
  },
});

export default SeatMapping;
