import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useSelector } from 'react-redux';
import TweetCard from '../Components/HomePage/TweetCard';
import { Box, Avatar, Typography, Button, Tabs, Tab } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import UserListModal from '../Components/UserListModal'; // ✅ unified modal

const UserProfilePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ title: '', userIds: [] });

  const navigate = useNavigate();
  const { username } = useParams();
  const { token } = useSelector(state => state.auth);
  const user1 = useSelector(state => state.auth.user);
  const user = user1?._id;

  const decode = jwtDecode(token);

  const [tweets, setTweets] = useState([]);
  const [likedTweets, setLikedTweets] = useState([]);
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState(0);

  const handleFollowToggle = async () => {
    try {
      await axios.put(`/user/follow/${profile._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      // Refetch full profile data after follow/unfollow
      const userRes = await axios.get(`/user/getUser/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(userRes.data);
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
          tweet._id === tweetId ? { ...tweet, retweets: updatedTweet.retweets } : tweet
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
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [username, token]);

  useEffect(() => {
    const fetchLikedTweets = async () => {
      if (tab === 3 && profile) {
        try {
          const res = await axios.get(`/tweet/likes/${profile._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLikedTweets(res.data);
        } catch (err) {
          console.error('Error fetching liked tweets:', err);
        }
      }
    };
    fetchLikedTweets();
  }, [tab, profile, token]);

  if (!profile) return null;

  const deduplicate = (array) => {
    return [...new Map(array.map(item => [item._id, item])).values()];
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
      <Box sx={{
        width: '100%',
        height: 180,
        backgroundImage: `url(${profile.wallpaper || ''})`,
        backgroundSize: 'cover'
      }} />

      <Box sx={{ px: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={0}>
          <Avatar
            src={profile.profilePic}
            sx={{
              width: 100,
              height: 100,
              border: '3px solid white',
              mt: -6
            }}
          />
          {decode.username === profile.username ? (
            <Button variant="contained" sx={{ bgcolor: 'black', borderRadius: 6 }}>
              Edit Profile
            </Button>
          ) : (
            <Button
              sx={{ bgcolor: 'black', borderRadius: 6 }}
              variant='contained'
              onClick={handleFollowToggle}
            >
              {profile.followers?.includes(decode.id) ? 'Following' : 'Follow'}
            </Button>
          )}
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <Box>
            <Typography variant="h6">{profile.name}</Typography>
            <Typography variant="body2" color="gray">@{profile.username}</Typography>
          </Box>
        </Box>

        {profile.bio && <Typography mt={1}>{profile.bio}</Typography>}

        <Typography variant="body2" color="gray" display="flex" alignItems="center" mt={1}>
          <CalendarMonthIcon fontSize="small" sx={{ mr: 0.5 }} />
          Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
        </Typography>

        <Box mt={1}>
          <Typography
            component="span"
            fontWeight="bold"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              setModalData({ title: 'Following', userIds: profile.following });
              setShowModal(true);
            }}
          >

            {profile.following?.length || 0}
            <Typography component="span" fontWeight="light" color='rgba(0, 0, 0, 0.54)'> Following</Typography>

          </Typography>
          &nbsp;
          <Typography
            component="span"
            fontWeight="bold"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              setModalData({ title: 'Followers', userIds: profile.followers });
              setShowModal(true);
            }}
          >
            {profile.followers?.length || 0}
            <Typography component="span" fontWeight="light" color='rgba(0, 0, 0, 0.54)'> Followers</Typography>

          </Typography>
        </Box>
      </Box>

      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} variant="fullWidth">
        <Tab label="Posts" />
        <Tab label="Replies" />
        <Tab label="Media" />
        <Tab label="Likes" />
      </Tabs>

      <Box>
        {tab === 0 &&
          deduplicate(tweets.filter(tweet => !tweet.replyTo)).map(tweet => (
            <TweetCard
              key={tweet._id}
              onLike={handleLike}
              onRetweet={handleRetweet}
              userId={user}
              tweet={tweet}
            />
          ))}

        {tab === 1 &&
          deduplicate(tweets.filter(tweet => tweet.replyTo)).map(tweet => (
            <TweetCard
              key={tweet._id}
              onLike={handleLike}
              onRetweet={handleRetweet}
              userId={user}
              tweet={tweet}
            />
          ))}

        {tab === 2 &&
          <Box sx={{ p: 1 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 1,
              }}
            >
              {deduplicate(tweets.filter(tweet => tweet.img && !tweet.isRetweet)).map(tweet => (
                <Box
                  key={tweet._id}
                  onClick={() => navigate(`/tweet/${tweet._id}`)}
                  sx={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderRadius: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={tweet.img}
                    alt="Tweet media"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        }

        {tab === 3 &&
          deduplicate(likedTweets).map(tweet => (
            <TweetCard
              key={tweet._id}
              onLike={handleLike}
              onRetweet={handleRetweet}
              userId={user}
              tweet={tweet}
            />
          ))}
      </Box>

      <UserListModal
        open={showModal}
        onClose={() => setShowModal(false)}
        users={modalData.userIds} // ✅ updated prop
        title={modalData.title}
      />
    </Box>
  );
};

export default UserProfilePage;
