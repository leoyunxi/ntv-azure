'use client';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import listboxSlice from './features/listbox/listboxSlice';
import searchResultsReducer from './features/searchResult/searchResultsSlice';

const rootReducer = combineReducers({
  listbox: listboxSlice,
  searchResults: searchResultsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
