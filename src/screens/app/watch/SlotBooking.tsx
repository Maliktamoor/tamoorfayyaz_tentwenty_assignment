import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { Text, TouchableOpacity } from '@config/core-ui';
import { hp, wp } from '@utilities/dimensions';
import { Svgs } from '@assets/svgs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '@config/store';
import { FontFamily } from '@assets/fonts';
import { Button } from '@components/button';

interface SelectedSeat {
  row: number;
  seat: number;
}

const SlotBooking = () => {
  const Colors = useSelector((state: RootState) => state?.colors?.colors);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [scale, setScale] = useState(new Animated.Value(1));
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  const zoomIn = () => {
    Animated.timing(scale, {
      //@ts-ignore
      toValue: Math.min(scale._value + 0.2, 3),
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const zoomOut = () => {
    Animated.timing(scale, {
      //@ts-ignore
      toValue: Math.max(scale._value - 0.2, 0.5),
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const layout = [
    [0, 0, 0, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 0, 0, 0],
    [0, 2, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 2, 1, 0],
    [0, 1, 2, 1, 1, 3, 3, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 3, 3, 1, 1, 2, 1, 0],
    [0, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 0],
    [1, 2, 2, 1, 1, 4, 4, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 4, 4, 1, 1, 1, 1, 1],
    [1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 2, 2, 1, 1],
    [1, 1, 3, 1, 1, 1, 1, 3, 3, 1, 1, 2, 2, 1, 1, 3, 3, 1, 1, 1, 2, 3, 1, 1, 1],
    [1, 2, 3, 1, 1, 1, 1, 3, 3, 1, 1, 2, 2, 1, 1, 3, 3, 1, 1, 1, 2, 3, 1, 1, 1],
    [1, 3, 2, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1],
    [1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1],
    [2, 2, 1, 1, 1, 2, 3, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1],
    [1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1],
    [1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1],
    [0, 1, 3, 3, 0, 0, 1, 3, 3, 0, 0, 0, 0, 0, 1, 3, 3, 0, 0, 0, 0, 1, 3, 3, 0],
  ];

  const handleSeatPress = (
    rowIndex: number,
    seatIndex: number,
    seatState: number,
  ) => {
    if (seatState === 0 || seatState === 4) return; // Can't select empty or reserved seats

    const seatKey = `${rowIndex}-${seatIndex}`;
    const existingIndex = selectedSeats.findIndex(
      s => `${s.row}-${s.seat}` === seatKey,
    );

    if (existingIndex >= 0) {
      // Deselect seat
      setSelectedSeats(selectedSeats.filter((_, i) => i !== existingIndex));
    } else {
      // Select seat
      setSelectedSeats([...selectedSeats, { row: rowIndex, seat: seatIndex }]);
    }
  };

  const removeSelectedSeat = (row: number, seat: number) => {
    setSelectedSeats(
      selectedSeats.filter(s => !(s.row === row && s.seat === seat)),
    );
  };

  const isSeatSelected = (rowIndex: number, seatIndex: number) => {
    return selectedSeats.some(s => s.row === rowIndex && s.seat === seatIndex);
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
            The King’s Man
          </Text>
          <Text
            style={[
              styles.releaseDate,
              { color: Colors.secondary, fontFamily: FontFamily.regular },
            ]}
          >
            March 5, 2021 I 12:30 hall 1
          </Text>
        </View>
        <View style={{ width: wp('6%') }} />
      </View>

      <Animated.View
        style={[
          styles.zoomBox,
          { transform: [{ scale }], backgroundColor: Colors.c7 },
        ]}
      >
        {layout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((seat, seatIndex) => {
              const isSelected = isSeatSelected(rowIndex, seatIndex);
              const seatState = isSelected ? 5 : seat;
              return (
                <TouchableOpacity
                  key={seatIndex}
                  onPress={() => handleSeatPress(rowIndex, seatIndex, seat)}
                  disabled={seat === 0 || seat === 4}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.seat,
                      {
                        backgroundColor:
                          seatState === 5
                            ? '#FFD700' // Golden-yellow for selected
                            : seatState === 1
                            ? Colors.c2
                            : seatState === 2
                            ? Colors.secondary
                            : seatState === 3
                            ? Colors.c3
                            : seatState === 4
                            ? Colors.c4
                            : 'transparent',
                        borderWidth: isSelected ? 2 : 0,
                        borderColor: '#FFD700',
                        marginRight: seatIndex == 4 || seatIndex == 19 ? 10 : 0,
                      },
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={zoomIn}
            style={[styles.buttonCon, { backgroundColor: Colors.c2 }]}
          >
            <Text>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={zoomOut}
            style={[styles.buttonCon, { backgroundColor: Colors.c2 }]}
          >
            <Text>-</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <View style={styles.titleOverlay}>
        <Svgs.curveLarge />
        <Text style={[styles.screenText, { color: Colors.c2 }]}>SCREEN</Text>
      </View>
      <View style={styles.bottomSection}>
        <View style={styles.legendContainer}>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: Colors.c6, borderColor: Colors.c6 },
                ]}
              />
              <Text style={[styles.legendText, { color: Colors.text }]}>
                Selected
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: Colors.c3, borderColor: Colors.c3 },
                ]}
              />
              <Text style={[styles.legendText, { color: Colors.text }]}>
                VIP (150$)
              </Text>
            </View>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: Colors.c2, borderColor: Colors.c2 },
                ]}
              />
              <Text style={[styles.legendText, { color: Colors.text }]}>
                Not available
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  {
                    backgroundColor: Colors.secondary,
                    borderColor: Colors.secondary,
                  },
                ]}
              />
              <Text style={[styles.legendText, { color: Colors.text }]}>
                Regular (50 $)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionRow}>
          <View
            style={[styles.totalPriceContainer, { backgroundColor: Colors.c7 }]}
          >
            <Text
              style={[
                styles.totalPriceLabel,
                { color: Colors.c1, fontFamily: FontFamily.regular },
              ]}
            >
              Total Price
            </Text>
            <Text
              style={[
                styles.totalPriceValue,
                { color: Colors.text, fontFamily: FontFamily.bold },
              ]}
            >
              $ 50
            </Text>
          </View>

          <View style={styles.buttonSection}>
            <Button
              title="Proceed to pay"
              onPress={() => {
                if (selectedSeats.length > 0) {
                  console.log('Proceeding to payment...');
                }
              }}
              containerStyle={{
                backgroundColor: Colors.secondary,
                width: '100%',
                paddingVertical: hp('2%'),
                borderRadius: wp('2%'),
              }}
              textStyle={{
                color: Colors.white,
                fontFamily: FontFamily.bold,
                fontSize: wp('4%'),
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default SlotBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('12%'),
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

  controls: {
    flexDirection: 'row',
    paddingTop: 10,
    gap: 20,
  },
  zoomBox: {
    width: '100%',
    height: 290,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 7,
    height: 7,
    margin: 2,
    borderRadius: 1,
  },
  titleOverlay: {
    position: 'absolute',
    top: 140,
    left: 40,
    right: 0,
  },
  screenText: {
    fontSize: wp('3.5%'),
    textAlign: 'center',
    fontFamily: FontFamily.semiBold,
    marginTop: hp('-3%'),
    marginLeft: wp('-10%'),
  },
  buttonCon: {
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  bottomSection: {
    marginTop: wp('15%'),
    marginHorizontal: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
    marginHorizontal: 20,
    backgroundColor: '#fff',
  },
  legendRow: {
    gap: hp('4%'),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  legendColor: {
    width: wp('4%'),
    height: wp('4%'),
    borderRadius: wp('1%'),
    borderWidth: 1,
  },
  legendText: {
    fontSize: wp('3%'),
    fontFamily: FontFamily.regular,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: wp('3%'),
    marginTop: wp('10%'),
  },
  totalPriceContainer: {
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
  },
  totalPriceLabel: {
    fontSize: wp('3%'),
    marginBottom: hp('0.5%'),
  },
  totalPriceValue: {
    fontSize: wp('5%'),
  },
  buttonSection: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
