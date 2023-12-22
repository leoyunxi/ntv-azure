// @ts-nocheck
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { genres, programNames, categorys } from '@/constant/conditionList';
import { log } from 'console';

interface ListboxState {
  source: string[];
  destination: string[];
}

interface ListboxSliceState {
  genre: ListboxState;
  programName: ListboxState;
  category: ListboxState;
}

const initialState: ListboxSliceState = {
  genre: {
    source: genres,
    destination: [],
  },
  programName: {
    source: programNames,
    destination: [],
  },
  category: {
    source: categorys,
    destination: [],
  },
};

const listboxSlice = createSlice({
  name: 'listbox',
  initialState,
  reducers: {
    addToDestination: (state, action: PayloadAction<{ key: string; items: string[] }>) => {
      const { key, items } = action.payload;
      state[key].destination = state[key].destination.concat(items);
      state[key].source = state[key].source.filter(item => !items.includes(item));
    },
    removeFromDestination: (state, action: PayloadAction<{ key: string; items: string[] }>) => {
      const { key, items } = action.payload;
      state[key].source = state[key].source.concat(items);
      state[key].destination = state[key].destination.filter(item => !items.includes(item));
    },
  },
});

export const { addToDestination, removeFromDestination } = listboxSlice.actions;
export default listboxSlice.reducer;
