import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const performSearch = createAsyncThunk(
  'search/performSearch',
  async (query) => {
    const response = await axios.get(`http://localhost:3000/api/profiles/search`, { params: { query } });
    console.log('API response:', response.data); // Debugging log
    return response.data;
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searchQuery: '',
    searchResults: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = []; // Clear the search results
    },
    setSearchStatus: (state, action) => {
      state.status = action.payload;
    },
    setSearchError: (state, action) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(performSearch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searchResults = action.payload;
        console.log('Search results:', action.payload); // Debugging log
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSearchQuery, setSearchResults, clearSearchResults, setSearchStatus, setSearchError } = searchSlice.actions;

export default searchSlice.reducer;
