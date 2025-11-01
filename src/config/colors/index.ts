import { createSlice } from '@reduxjs/toolkit';


export interface ColorsTypes {
  primary: string;
  secondary: string;
  black: string;
  white: string;
  text: string;
  c1: string;
  c2: string;
  c3: string;
  c4: string;
  c5: string;
  c6: string;
  
  isDarkMode: boolean;
}





const lightMode = {
  primary: '#2E2739',
  secondary: '#61C3F2',
  black: '#000000',
  white: '#FFFFFF',
  text: '#202C43',
  c1: '#827D88',
  c2: '#DBDBDF',
  c3: '#15D2BC',
  c4: '#E26CA5',
  c5: '#564CA3',
  c6: '#CD9D0F',
  c7: '#F6F6FA',

  isDarkMode: false,
};

const darkMode = {
  primary: '#2E2739',
  secondary: '#61C3F2',
  black: '#000000',
  white: '#FFFFFF',
  text: '#202C43',
  c1: '#827D88',
  c2: '#DBDBDF',
  c3: '#15D2BC',
  c4: '#E26CA5',
  c5: '#564CA3',
  c6: '#CD9D0F',
  c7: '#F6F6FA',
  isDarkMode: true,
};

const colorsSlice = createSlice({
  name: 'colors',
  initialState: {
    isDarkMode: false,
    colors: lightMode,
  },
  reducers: {
    ChangeThemeMode: (state, action) => {
      if (action.payload == true) {
        state.isDarkMode = true;
        state.colors = darkMode
      } else {
        state.isDarkMode = false;
        state.colors = lightMode
      }
    },
  },
});

export const { ChangeThemeMode } = colorsSlice.actions;

export default colorsSlice.reducer;
