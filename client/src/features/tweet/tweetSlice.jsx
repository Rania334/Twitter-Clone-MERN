// features/tweet/tweetSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Initial State
const initialState = {
  tweet: null,
  comments: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchTweetById = createAsyncThunk('tweet/fetchById', async (id, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const res = await axios.get(`/tweet/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchComments = createAsyncThunk('tweet/fetchComments', async (id, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const res = await axios.get(`/comment/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const postComment = createAsyncThunk('tweet/postComment', async ({ tweetId, content }, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const res = await axios.post(
      `/comment/add`,
      { tweetId, content },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const postReply = createAsyncThunk('tweet/postReply', async ({ commentId, content }, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const res = await axios.post(
      `/comment/reply`,
      { commentId, content },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );
    return { commentId, reply: res.data };
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// Slice
const tweetSlice = createSlice({
  name: 'tweet',
  initialState,
  reducers: {
    setTweetManually: (state, action) => {
      state.tweet = action.payload;
    },
    updateTweetLikes: (state, action) => {
      state.tweet.likes = action.payload;
    },
    updateTweetRetweets: (state, action) => {
      state.tweet.retweets = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTweetById.pending, (state) => {
        state.loading = true;
        state.tweet = null;
      })
      .addCase(fetchTweetById.fulfilled, (state, action) => {
        state.loading = false;
        state.tweet = action.payload;
      })
      .addCase(fetchTweetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })

      .addCase(postComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })

      .addCase(postReply.fulfilled, (state, action) => {
        const comment = state.comments.find((c) => c._id === action.payload.commentId);
        if (comment) {
          comment.replies = [...(comment.replies || []), action.payload.reply];
        }
      });
  },
});

export const { setTweetManually, updateTweetLikes, updateTweetRetweets } = tweetSlice.actions;

export default tweetSlice.reducer;
