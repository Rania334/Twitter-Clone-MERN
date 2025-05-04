import React, { useEffect, useRef, useCallback } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchTweets,
  createTweet,
  likeTweet,
  retweetTweet,
  incrementPage
} from '../features/tweetSlice';
import TweetInputBox from '../Components/HomePage/TweetInputBox';
import TweetCard from '../Components/HomePage/TweetCard';
import TweetSkeleton from '../Components/TweetSkeleton';

const Home = () => {
  const dispatch = useDispatch();
  const observer = useRef();

  const { tweets, page, hasMore, loading, initialLoad } = useSelector(state => state.tweets);
  const { token, user } = useSelector(state => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchTweets({ page }));
    }
  }, [page, token, dispatch]);

  const handleCreateTweet = (content, image) => {
    dispatch(createTweet({ content, image }));
  };

  const handleLike = (tweetId) => {
    dispatch(likeTweet(tweetId));
  };

  const handleRetweet = (tweetId) => {
    dispatch(retweetTweet(tweetId));
  };

  const lastTweetRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        dispatch(incrementPage());
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, dispatch]);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <TweetInputBox onTweet={handleCreateTweet} />

      {initialLoad
        ? Array.from({ length: 5 }).map((_, idx) => <TweetSkeleton key={idx} />)
        : tweets.map((tweet, index) => (
            <div ref={index === tweets.length - 1 ? lastTweetRef : null} key={tweet._id}>
              <TweetCard
                tweet={tweet}
                userId={user}
                onLike={handleLike}
                onRetweet={handleRetweet}
              />
            </div>
          ))}

      {loading && !initialLoad && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};

export default Home;
