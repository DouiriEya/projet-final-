// store.js
import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice';
import friendRequestSlice from './friendRequestSlice';
import NotificationSlice from './NotificationSlice';
import postSearchReducer from './searchPostsSlice';


const store = configureStore({
  reducer: {
    search: searchReducer,
    friendRequest: friendRequestSlice,
    notification: NotificationSlice,
    postSearch: postSearchReducer,
    

  }
});

export default store;
