import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch search results for posts
export const searchPosts = createAsyncThunk(
  'postSearch/searchPosts',
  async (filters, { rejectWithValue }) => {
    try {
      if (Object.keys(filters).length === 0) {
        // Return an empty array if filters are empty
        return { post: [] };
      }

      const response = await axios.get('http://localhost:3000/api/posts/searchpost', { params: filters });
      console.log('response:', response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const postSearchSlice = createSlice({
  name: 'postSearch',
  initialState: {
    searchFilters: {
      startlocation: '',
      date: '',
      destination: '',
    },
    searchResults: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setSearchFilters: (state, action) => {
      state.searchFilters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searchResults = action.payload.post; // Update search results with fetched data
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Use payload for error message
      });
  },
});

export const { setSearchFilters } = postSearchSlice.actions;

export default postSearchSlice.reducer;
