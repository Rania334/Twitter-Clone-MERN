import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Collapse,Avatar, Divider,IconButton
} from '@mui/material';
import {
  ChatBubbleOutline,
  Repeat,
  FavoriteBorder,
  IosShare,
  BarChart,
} from '@mui/icons-material';


const TweetDetails = () => {
  const { id } = useParams();
  const [tweet, setTweet] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyTexts, setReplyTexts] = useState({});
  const [showReplyInputs, setShowReplyInputs] = useState({});
  const { token } = useSelector(state => state.auth);
  

  useEffect(() => {
    const fetchTweetAndComments = async () => {
      try {
        const tweetRes = await axios.get('http://localhost:5000/api/tweet', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const foundTweet = tweetRes.data.find(t => t._id === id);
        setTweet(foundTweet);

        const commentsRes = await axios.get(`http://localhost:5000/api/comment/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(commentsRes.data);
      } catch (error) {
        console.error('Error loading tweet or comments', error);
      }
    };

    fetchTweetAndComments();
  }, [id, token]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/comment/add',
        {
          tweetId: id,
          content: commentText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments(prev => [...prev, response.data]);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  const handleReplyClick = (commentId) => {
    setShowReplyInputs(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleReplyChange = (commentId, value) => {
    setReplyTexts(prev => ({ ...prev, [commentId]: value }));
  };

  const handleAddReply = async (commentId) => {
    const replyText = replyTexts[commentId];
    if (!replyText?.trim()) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/comment/reply',
        {
          commentId,
          content: replyText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments(prev =>
        prev.map(comment =>
          comment._id === commentId
            ? { ...comment, replies: [...(comment.replies || []), response.data] }
            : comment
        )
      );

      setReplyTexts(prev => ({ ...prev, [commentId]: '' }));
      setShowReplyInputs(prev => ({ ...prev, [commentId]: false }));
    } catch (error) {
      console.error('Error adding reply', error);
    }
  };

  if (!tweet) return <Typography>Loading...</Typography>;

  return (<Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
    {/* Tweet Info */}
    <Box sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" mb={1}>
        <Avatar src={tweet.user.profilePic || '/default-profile.png'} sx={{ width: 48, height: 48, mr: 2 }} />
        <Box>
          <Typography fontWeight="bold">{tweet.user.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            @{tweet.user.username}
          </Typography>
        </Box>
      </Box>
  
      {/* Tweet Content */}
      <Typography variant="body1" sx={{ mb: 2 }}>
        {tweet.content}
      </Typography>
  
      {/* Tweet Image (if exists) */}
      {tweet.img && (
        <Box
          component="img"
          src={tweet.img}
          alt="Tweet"
          sx={{
            width: '100%',
            borderRadius: 2,
            mb: 2,
            maxHeight: 500,
            objectFit: 'cover',
          }}
        />
      )}
  
      {/* Divider */}
      <Divider sx={{ my: 2 }} />
  
      {/* 5 Icons: reply, retweet, like, share, view */}
      <Box display="flex" justifyContent="space-around" alignItems="center" sx={{ color: 'gray' }}>
        <IconButton>
          <ChatBubbleOutline fontSize="small" />
        </IconButton>
        <IconButton>
          <Repeat fontSize="small" />
        </IconButton>
        <IconButton>
          <FavoriteBorder fontSize="small" />
        </IconButton>
        <IconButton>
          <IosShare fontSize="small" />
        </IconButton>
        <IconButton>
          <BarChart fontSize="small" />
        </IconButton>
      </Box>
  
      <Divider sx={{ my: 2 }} />
    </Box>
  
    {/* Add Comment Section */}
    <Box sx={{ p: 2 }}>
      <TextField
        label="Write a comment"
        multiline
        fullWidth
        rows={3}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <Button
        variant="contained"
        sx={{ mt: 1, borderRadius: 2 }}
        onClick={handleAddComment}
      >
        Post Comment
      </Button>
    </Box>
  
    {/* Replies Section */}
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Replies
      </Typography>
      {comments.map((comment) => (
        <Box key={comment._id} sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" mb={1}>
            <Avatar sx={{ width: 32, height: 32, mr: 1 }} />
            <Typography fontWeight="bold">{comment.user.username}</Typography>
          </Box>
          <Typography variant="body2" sx={{ ml: 5 }}>{comment.content}</Typography>
  
          <Button size="small" onClick={() => handleReplyClick(comment._id)} sx={{ textTransform: 'none', ml: 5 }}>
            Reply
          </Button>
  
          <Collapse in={showReplyInputs[comment._id] || false} sx={{ ml: 5, mt: 1 }}>
            <TextField
              multiline
              fullWidth
              rows={2}
              value={replyTexts[comment._id] || ''}
              onChange={(e) => handleReplyChange(comment._id, e.target.value)}
              placeholder="Write your reply..."
              sx={{ mb: 1 }}
            />
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleAddReply(comment._id)}
            >
              Submit Reply
            </Button>
          </Collapse>
  
          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <Box sx={{ mt: 1, ml: 5, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
              {comment.replies.map((reply) => (
                <Box key={reply._id} sx={{ mb: 1 }}>
                  <Typography fontWeight="bold">{reply.user?.username || 'User'}</Typography>
                  <Typography variant="body2">{reply.content}</Typography>
                </Box>
              ))}
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
        </Box>
      ))}
    </Box>
  </Box>
  
  );
};

export default TweetDetails;
