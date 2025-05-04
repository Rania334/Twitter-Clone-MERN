import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import {
  ChatBubbleOutline,
  Repeat,
  RepeatOutlined,
  IosShare,
  BarChart,
} from '@mui/icons-material';
import axios from '../../utils/axios';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateTweetLikes,
  updateTweetRetweets,
} from '../../features/tweet/tweetSlice';
import LikeButton from '../HomePage/LikeButton';

const TweetActions = ({ tweet }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const liked = tweet.likes.includes(tweet.user._id);
  const retweeted = tweet.retweets.includes(tweet.user._id);

  const handleLike = async (tweetId) => {
    try {
      const res = await axios.put(`/tweet/${tweetId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(updateTweetLikes(res.data.tweet.likes));
    } catch (err) {
      console.error('Error liking tweet:', err);
    }
  };

  const handleRetweet = async (tweetId) => {
    try {
      const res = await axios.put(`/tweet/${tweetId}/retweet`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(updateTweetRetweets(res.data.tweet.retweets));
    } catch (err) {
      console.error('Error retweeting tweet:', err);
    }
  };

  return (
    <Box display="flex" justifyContent="space-around" alignItems="center" sx={{ color: 'gray' }}>
      <IconButton><ChatBubbleOutline fontSize="small" /></IconButton>

      <Box display="flex" alignItems="center" gap={0.5}>
        <IconButton onClick={(e) => { e.stopPropagation(); handleRetweet(tweet._id); }}>
          {retweeted ? <Repeat fontSize="small" color="primary" /> : <RepeatOutlined fontSize="small" />}
        </IconButton>
        <Typography variant="caption">{tweet.retweets.length}</Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={0.5}>
        <LikeButton
          liked={liked}
          onClick={(e) => { e.stopPropagation(); handleLike(tweet._id); }}
        />
        <Typography variant="caption">{tweet.likes.length}</Typography>
      </Box>

      <IconButton><IosShare fontSize="small" /></IconButton>
      <IconButton><BarChart fontSize="small" /></IconButton>
    </Box>
  );
};

export default TweetActions;
