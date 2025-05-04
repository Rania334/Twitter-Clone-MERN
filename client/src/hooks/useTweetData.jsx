// hooks/useTweetData.js
import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useSelector } from 'react-redux';

export const useTweetData = (tweetId) => {
  const [tweet, setTweet] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchTweetAndComments = async () => {
      try {
        const tweetRes = await axios.get(`/tweet/${tweetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTweet(tweetRes.data);

        const commentsRes = await axios.get(`/comment/${tweetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(commentsRes.data);
      } catch (error) {
        console.error('Failed loading tweet/comments', error);
      } finally {
        setLoading(false);
      }
    };

    if (!tweet && tweetId && token) {
      fetchTweetAndComments();
    }
  }, [tweetId, token, tweet]);

  return { tweet, setTweet, comments, setComments, loading };
};
