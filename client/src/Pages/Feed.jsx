import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTweets } from '../features/tweets/tweetSlice';
import TweetCard from '../Components/TweetCard';
import { Container, Typography, CircularProgress } from '@mui/material';

export default function Feed() {
  const dispatch = useDispatch();
  const { tweets, loading } = useSelector((state) => state.tweets);

  useEffect(() => {
    dispatch(fetchTweets());
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Feed</Typography>
      {loading ? <CircularProgress /> : (
        tweets.map((tweet) => (
          <TweetCard key={tweet._id} tweet={tweet} />
        ))
      )}
    </Container>
  );
}
