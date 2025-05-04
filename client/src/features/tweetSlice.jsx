// redux/slices/tweetSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios.jsx';

export const fetchTweets = createAsyncThunk(
  'tweets/fetchTweets',
  async ({ page = 1 }, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.get(`/tweet?page=${page}&limit=10`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: res.data, page };
  }
);

export const createTweet = createAsyncThunk(
  'tweets/createTweet',
  async ({ content, image }, { getState, dispatch }) => {
    const token = getState().auth.token;
    const formData = new FormData();
    formData.append('content', content);
    if (image) formData.append('image', image);
    await axios.post('/tweet', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch(fetchTweets({ page: 1 }));
  }
);

// Like tweet
export const likeTweet = createAsyncThunk(
  'tweets/likeTweet',
  async (tweetId, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.put(`/tweet/${tweetId}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.tweet;
  }
);

// Retweet
export const retweetTweet = createAsyncThunk(
  'tweets/retweetTweet',
  async (tweetId, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.put(`/tweet/${tweetId}/retweet`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.tweet;
  }
);

const tweetSlice = createSlice({
  name: 'tweets',
  initialState: {
    tweets: [],
    loading: false,
    page: 1,
    hasMore: true,
    initialLoad: true,
  },
  reducers: {
    resetTweets: (state) => {
      state.tweets = [];
      state.page = 1;
      state.hasMore = true;
      state.initialLoad = true;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTweets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTweets.fulfilled, (state, action) => {
        const { data, page } = action.payload;
        state.tweets = page === 1 ? data : [...state.tweets, ...data];
        state.hasMore = data.length === 10;
        state.loading = false;
        state.initialLoad = false;
      })
      .addCase(fetchTweets.rejected, (state) => {
        state.loading = false;
      })
      .addCase(likeTweet.fulfilled, (state, action) => {
        const updated = action.payload;
        state.tweets = state.tweets.map(t =>
          t._id === updated._id ? { ...t, likes: updated.likes } : t
        );
      })
      .addCase(retweetTweet.fulfilled, (state, action) => {
        const updated = action.payload;
        state.tweets = state.tweets.map(t =>
          t._id === updated._id ? updated : t
        );
      });
  },
});

export const { resetTweets, incrementPage } = tweetSlice.actions;
export default tweetSlice.reducer;
