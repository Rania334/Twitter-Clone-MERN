import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from '../utils/axios';
import { useSelector } from 'react-redux';
import TweetCard from '../Components/HomePage/TweetCard';
import { Box, Avatar, Typography, Button, Tabs, Tab } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const TWEETS_LIMIT = 10;

const UserProfilePage = () => {
  const { username } = useParams();
  const { token } = useSelector(state => state.auth);
  const user = useSelector(state => state.auth.user)?._id;
  const decode = jwtDecode(token);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState(0);

  const [tweets, setTweets] = useState([]);
  const [likedTweets, setLikedTweets] = useState([]);
  const [hasMoreTweets, setHasMoreTweets] = useState(true);
  const [hasMoreLikes, setHasMoreLikes] = useState(true);

  const observer = useRef();

  const lastTweetRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (tab === 0 && hasMoreTweets) loadTweets();
        else if (tab === 3 && hasMoreLikes) loadLikedTweets();
      }
    });
    if (node) observer.current.observe(node);
  }, [tab, hasMoreTweets, hasMoreLikes]);

  const handleFollowToggle = async () => {
    try {
      const res = await axios.put(`/user/follow/${profile._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(prev => ({
        ...prev,
        followers: res.data.followers,
      }));
    } catch (err) {
      console.error('Follow toggle failed:', err);
    }
  };

  const handleLike = async (tweetId) => {
    try {
      const res = await axios.put(`/tweet/${tweetId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedTweet = res.data.tweet;
      setTweets(prev =>
        prev.map(tweet => tweet._id === tweetId ? { ...tweet, likes: updatedTweet.likes } : tweet)
      );
    } catch (err) {
      console.error('Error liking tweet:', err);
    }
  };

  const handleRetweet = async (tweetId) => {
    try {
      const res = await axios.put(`/tweet/${tweetId}/retweet`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedTweet = res.data.tweet;
      setTweets(prev =>
        prev.map(tweet => tweet._id === tweetId ? { ...tweet, retweets: updatedTweet.retweets } : tweet)
      );
    } catch (err) {
      console.error('Error retweeting tweet:', err);
    }
  };

  const loadTweets = async () => {
    try {
      const skip = tweets.length;
      const res = await axios.get(`/tweet/${username}/timeline?skip=${skip}&limit=${TWEETS_LIMIT}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTweets(prev => [...prev, ...res.data]);
      if (res.data.length < TWEETS_LIMIT) setHasMoreTweets(false);
    } catch (err) {
      console.error('Error loading tweets:', err);
    }
  };

  const loadLikedTweets = async () => {
    try {
      const skip = likedTweets.length;
      const res = await axios.get(`/tweet/likes/${profile._id}?skip=${skip}&limit=${TWEETS_LIMIT}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikedTweets(prev => [...prev, ...res.data]);
      if (res.data.length < TWEETS_LIMIT) setHasMoreLikes(false);
    } catch (err) {
      console.error('Error loading liked tweets:', err);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userRes = await axios.get(`/user/getUser/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(userRes.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchUserProfile();
  }, [username, token]);

  useEffect(() => {
    setTweets([]);
    setLikedTweets([]);
    setHasMoreTweets(true);
    setHasMoreLikes(true);

    if (tab === 0) loadTweets();
    if (tab === 3 && profile) loadLikedTweets();
  }, [tab, profile]);

  if (!profile) return null;

  const deduplicate = (array) => [...new Map(array.map(item => [item._id, item])).values()];

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
      <Box sx={{ height: 180, backgroundImage: `url(${profile.wallpaper || ''})`, backgroundSize: 'cover' }} />
      <Box sx={{ px: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={0}>
          <Avatar src={profile.profilePic} sx={{ width: 100, height: 100, border: '3px solid white', mt: -6 }} />
          {decode.username === profile.username ? (
            <Button variant="contained" sx={{ bgcolor: 'black', borderRadius: 6 }}>Edit Profile</Button>
          ) : (
            <Button variant="contained" onClick={handleFollowToggle} sx={{ bgcolor: 'black', borderRadius: 6 }}>
              {profile.followers?.includes(decode.id) ? 'Following' : 'Follow'}
            </Button>
          )}
        </Box>
        <Typography variant="h6">{profile.name}</Typography>
        <Typography variant="body2" color="gray">@{profile.username}</Typography>
        {profile.bio && <Typography mt={1}>{profile.bio}</Typography>}
        <Typography variant="body2" color="gray" display="flex" alignItems="center" mt={1}>
          <CalendarMonthIcon fontSize="small" sx={{ mr: 0.5 }} />
          Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
        </Typography>
        <Box mt={1}>
          <Typography component="span" fontWeight="bold">{profile.following?.length || 0}</Typography> <Typography component="span" color='gray'>Following</Typography> &nbsp;
          <Typography component="span" fontWeight="bold">{profile.followers?.length || 0}</Typography> <Typography component="span" color='gray'>Followers</Typography>
        </Box>
      </Box>

      <Tabs value={tab} onChange={(e, val) => setTab(val)} variant="fullWidth">
        <Tab label="Posts" />
        <Tab label="Replies" />
        <Tab label="Media" />
        <Tab label="Likes" />
      </Tabs>

      <Box>
        {tab === 0 &&
          deduplicate(tweets.filter(tweet => !tweet.replyTo)).map((tweet, idx, arr) => (
            <TweetCard
              key={tweet._id}
              ref={idx === arr.length - 1 ? lastTweetRef : null}
              tweet={tweet}
              userId={user}
              onLike={handleLike}
              onRetweet={handleRetweet}
            />
          ))
        }

        {tab === 1 &&
          deduplicate(tweets.filter(tweet => tweet.replyTo)).map(tweet => (
            <TweetCard
              key={tweet._id}
              tweet={tweet}
              userId={user}
              onLike={handleLike}
              onRetweet={handleRetweet}
            />
          ))
        }

        {tab === 2 &&
          <Box sx={{ p: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 1 }}>
            {deduplicate(tweets.filter(tweet => tweet.img && !tweet.isRetweet)).map(tweet => (
              <Box key={tweet._id} onClick={() => navigate(`/tweet/${tweet._id}`)} sx={{
                width: '100%',
                aspectRatio: '1 / 1',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 2,
              }}>
                <Box component="img" src={tweet.img} alt="Tweet media" sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }} />
              </Box>
            ))}
          </Box>
        }

        {tab === 3 &&
          deduplicate(likedTweets).map((tweet, idx, arr) => (
            <TweetCard
              key={tweet._id}
              ref={idx === arr.length - 1 ? lastTweetRef : null}
              tweet={tweet}
              userId={user}
              onLike={handleLike}
              onRetweet={handleRetweet}
            />
          ))
        }
      </Box>
    </Box>
  );
};

export default UserProfilePage;
