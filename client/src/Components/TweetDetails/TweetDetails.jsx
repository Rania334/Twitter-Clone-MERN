import React, { useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTweetById,
  fetchComments,
  setTweetManually,
} from '../../features/tweet/tweetSlice';
import TweetHeader from './TweetHeader';
import TweetActions from './TweetActions';
import CommentSection from './CommentSection';
import TweetSkeleton from '../TweetSkeleton'

const TweetDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const initialTweet = location.state?.tweet;
  const dispatch = useDispatch();

  const { tweet, loading } = useSelector((state) => state.tweet);

  useEffect(() => {
    if (initialTweet) {
      dispatch(setTweetManually(initialTweet));
    } else {
      dispatch(fetchTweetById(id));
    }
    dispatch(fetchComments(id));
  }, [dispatch, id, initialTweet]);

  if (loading || !tweet)  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <TweetSkeleton/>
      
    </Box>);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <TweetHeader tweet={tweet} />
      <TweetActions tweet={tweet} />
      <Divider sx={{ my: 2 }} />
      <CommentSection tweetId={id} />
    </Box>
  );
};

export default TweetDetails;
