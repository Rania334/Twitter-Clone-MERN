import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useSelector } from 'react-redux';
import TweetCard from '../Components/HomePage/TweetCard'; // Component for rendering each tweet
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const UserProfilePage = () => {

  const { username } = useParams();

    const [tweets, setTweets] = useState([]);
    const { token } = useSelector(state => state.auth);

    const decode = jwtDecode(token)
    console.log(decode.username);
    const handleLike = async (tweetId) => {
        try {
          const res = await axios.put(`/tweet/${tweetId}/like`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const updatedTweet = res.data.tweet;
          setTweets(prev =>
            prev.map(tweet =>
              tweet._id === tweetId ? { ...tweet, likes: updatedTweet.likes } : tweet
            )
          );
        } catch (error) {
          console.error('Error liking tweet:', error);
        }
      };
    

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const res = await axios.get(`/tweet/${username}/timeline`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTweets(res.data);
            } catch (err) {
                console.error('Error fetching profile tweets:', err);
            }
        };

        fetchTimeline();
    }, [username, token]);
    const handleRetweet = async (tweetId) => {
        try {
          const res = await axios.put(`/tweet/${tweetId}/retweet`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const updatedTweet = res.data.tweet;
          setTweets(prev =>
            prev.map(tweet =>
              tweet._id === tweetId ? updatedTweet : tweet
            )
          );
        } catch (error) {
          console.error('Error retweeting:', error);
        }
      };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <div className="profile-timeline">
                {tweets.map(tweet => (
                    <TweetCard onLike={handleLike} userId={tweet.user?._id} tweet={tweet} onRetweet={handleRetweet} />
                ))}
            </div>
        </Box>
    );
};

export default UserProfilePage;
