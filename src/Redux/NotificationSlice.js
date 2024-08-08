import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching notifications
export const fetchNotifications = createAsyncThunk(
  'notification/fetch',
  async (userId) => {
    try {
      const response = await axios.get('http://localhost:3000/api/notification/getnotifs/', {
        params: {
          userId: userId
        }
      });
      console.log('response:', response);
      return response.data.notif;
    
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }
);

// Redux slice
const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Selector to get notifications
export const selectNotifications = (state) => state.notification.notifications;
export const selectNotificationStatus = (state) => state.notification.status;
export const selectNotificationError = (state) => state.notification.error;

export default notificationSlice.reducer;
