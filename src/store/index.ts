import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore, Middleware } from '@reduxjs/toolkit';
import { persistReducer, PersistConfig } from 'redux-persist';
import { api } from '@config/services';

import colorsReducer from '@config/colors'; 

// Define a type for the reducers
const rootReducer = combineReducers({
    colors: colorsReducer, 
    [api.reducerPath]: api.reducer,
});

// Define the type for the state managed by the combined reducers
export type RootReducer = ReturnType<typeof rootReducer>;

// Type the persist config
const persistConfig: PersistConfig<RootReducer> = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['colors'],
};

// Create the persisted reducer
const persistedReducer = persistReducer<RootReducer>(persistConfig, rootReducer);

// Define middleware array as an empty array, typed properly
const middlewares: Middleware[] = [];

// Configure the store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializable check for persisted data
        }).concat(api.middleware, ...middlewares), // Spread middlewares
});

// Infer the type of the RootState from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Define the AppDispatch type
export type AppDispatch = typeof store.dispatch;

export default store;
