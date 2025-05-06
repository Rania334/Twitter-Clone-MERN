import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import MyIcon from '../../assets/MyIcon';
import Retweet from '../../assets/retweet';

import {

  IosShare,
} from '@mui/icons-material';
import axios from '../../utils/axios';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateTweetLikes,
  updateTweetRetweets,
} from '../../features/tweet/tweetSlice';
import LikeButton from '../HomePage/LikeButton';
import './TweetCard.css'

const TweetActions = ({ tweet }) => {
  const dispatch = useDispatch();
  // const { token } = useSelector((state) => state.auth);
  const { token, user } = useSelector((state) => state.auth);

  const liked = tweet.likes.includes(user);
  const retweeted = tweet.retweets.includes(user);
  console.log(tweet.user._id);
  console.log(tweet.retweets);


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
      <Box display="flex" alignItems="center" gap={0.5}>
        <IconButton size="small" onClick={(e) => e.stopPropagation()}>
          <MyIcon className="CommentIcon" />
        </IconButton>
        <Typography variant="caption">{tweet.comments.length}</Typography>
      </Box>
      <Box display="flex" alignItems="center" gap={0.5}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleRetweet(tweet._id);
          }}
        >
          {retweeted ? (
            <Retweet fill="#00BA7C" className="RetweetIcon" />
          ) : (
            <Retweet fill="gray" className="RetweetIcon" />
          )}
        </IconButton>
        <Typography variant="caption">{tweet.retweets.length}</Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={0.5}>
        <LikeButton
          liked={liked}
          onClick={(e) => {
            e.stopPropagation();
            handleLike(tweet._id);
          }}
        />
        <Typography variant="caption">{tweet.likes.length}</Typography>
      </Box>

      <IconButton><IosShare fontSize="small" /></IconButton>
    </Box>
  );
};

export default TweetActions;
