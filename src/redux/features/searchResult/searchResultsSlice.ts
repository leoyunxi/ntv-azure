import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchResult {
  key: string;
  thumbnail: string;
  recordStartTime: string;
  materialNo: string;
  genre: string;
  programName: string;
  category: string;
  title: string;
}

interface SearchResultsState {
  results: SearchResult[];
}

const initialState: SearchResultsState = {
  results: [],
};

const searchResultsSlice = createSlice({
  name: 'searchResults',
  initialState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<SearchResult[]>) => {
      state.results = action.payload;
    },
    clearSearchResults: state => {
      state.results = [];
    },
  },
});

export const { setSearchResults, clearSearchResults } = searchResultsSlice.actions;
export default searchResultsSlice.reducer;
