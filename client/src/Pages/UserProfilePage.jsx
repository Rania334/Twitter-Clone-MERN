import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useSelector } from 'react-redux';
import TweetCard from '../Components/HomePage/TweetCard';
import { Box, Avatar, Typography, Button, Tabs, Tab } from '@mui/material';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const UserProfilePage = () => {
  const { username } = useParams();
  const { token,user } = useSelector(state => state.auth);
  const decode = jwtDecode(token);

  const [tweets, setTweets] = useState([]);
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState(0);
  const handleFollowToggle = async () => {
    try {
      const res = await axios.put(`/user/follow/${profile._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(prev => ({
        ...prev,
        followers: res.data.followers,
        // following: res.data.following
      }));
    } catch (err) {
      console.error('Error following/unfollowing:', err);
    }
  };


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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`/user/getUser/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(userRes.data);

        const tweetRes = await axios.get(`/tweet/${username}/timeline`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTweets(tweetRes.data);
        console.log(userRes.data, tweetRes.data);

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [username, token]);

  if (!profile) return null;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
      {/* Banner */}
      <Box sx={{ width: '100%', height: 180, backgroundImage: `url(${profile.wallpaper || ''})`, backgroundSize: 'cover' }} />

      {/* Avatar, name, username */}
      <Box sx={{ px: 2 }}>
        <Avatar
          src={profile.profilePic}
          sx={{
            width: 100,
            height: 100,
            border: '3px solid white',
            mt: -6
          }}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <Box>
            <Typography variant="h6">{profile.name}</Typography>
            <Typography variant="body2" color="gray">@{profile.username}</Typography>
          </Box>
          {decode.username === profile.username ? (
            <Button variant="outlined">Edit Profile</Button>
          ) : (
            <Button
              variant={profile.followers?.includes(decode.id) ? 'outlined' : 'contained'}
              onClick={handleFollowToggle}
            >
              {profile.followers?.includes(decode.id) ? 'Following' : 'Follow'}
            </Button>
          )}

        </Box>
        {/* Bio */}
        {profile.bio && <Typography mt={1}>{profile.bio}</Typography>}

        {/* Joined Date */}
        <Typography variant="body2" color="gray" display="flex" alignItems="center" mt={1}>
          <CalendarMonthIcon fontSize="small" sx={{ mr: 0.5 }} />
          Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
        </Typography>

        {/* Following/Followers */}
        <Box mt={1}>
          <Typography component="span" fontWeight="bold">{profile.following?.length || 0}</Typography> Following &nbsp;
          <Typography component="span" fontWeight="bold">{profile.followers?.length || 0}</Typography> Followers
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} variant="fullWidth">
        <Tab label="Posts" />
        <Tab label="Replies" />
        <Tab label="Media" />
        <Tab label="Likes" />
      </Tabs>

      {/* Tweets List */}
      <Box>
        {tweets.map(tweet => (
          <TweetCard
            key={tweet._id}
            onLike={handleLike}
            onRetweet={handleRetweet}
            userId={user}
            tweet={tweet}
          />
        ))}
      </Box>
    </Box>
  );
};

export default UserProfilePage;
