import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for sending a friend request
export const sendFriendRequest = createAsyncThunk(
  'friendRequest/send',
  async ({ senderId, receiverId }) => {
    const response = await axios.post('http://localhost:3000/api/friendRequests/send', { senderId, receiverId });
    return response.data;
  }
);

// Async thunk for accepting a friend request
export const acceptFriendRequest = createAsyncThunk(
  'friendRequest/accept',
  async ({ senderId, receiverId }) => {
    const response = await axios.put('http://localhost:3000/api/friendRequests/accept', { senderId, receiverId });
    return response.data;
  }
);

// Async thunk for declining a friend request
export const declineFriendRequest = createAsyncThunk(
  'friendRequest/decline',
  async ({ senderId, receiverId }) => {
    const response = await axios.put('http://localhost:3000/api/friendRequests/decline', { senderId, receiverId });
    return response.data;
  }
);

// Redux slice
const friendRequestSlice = createSlice({
  name: 'friendRequest',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        const { senderId, receiverId } = action.meta.arg;
        state[`${senderId}_${receiverId}`] = 'sent';
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        const { senderId, receiverId } = action.meta.arg;
        state[`${senderId}_${receiverId}`] = 'accepted';
      })
      .addCase(declineFriendRequest.fulfilled, (state, action) => {
        const { senderId, receiverId } = action.meta.arg;
        delete state[`${senderId}_${receiverId}`];
      });
  },
});

// Selector to get the status of a friend request
export const selectFriendRequestStatus = (state, senderId, receiverId) => {
  return state.friendRequest[`${senderId}_${receiverId}`] || 'not_sent';
};

export default friendRequestSlice.reducer;
