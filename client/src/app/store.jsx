import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import tweetsReducer from '../features/tweetSlice'; // for tweet list
import tweetDetailReducer from '../features/tweet/tweetSlice'; // for tweet detail/comments

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tweets: tweetsReducer,
    tweet: tweetDetailReducer, // different slice
  },
});
