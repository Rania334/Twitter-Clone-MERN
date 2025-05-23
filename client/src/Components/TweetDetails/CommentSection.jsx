import React, { useState } from 'react';
import {
  Box, TextField,Popover, Button, Typography, IconButton
} from '@mui/material';
import EmojiPicker from 'emoji-picker-react';

import {  SentimentSatisfiedOutlined as EmojiIcon,
  BrokenImageOutlined, GifBoxOutlined, SentimentSatisfiedOutlined, FmdGoodOutlined,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { postComment, fetchComments } from '../../features/tweet/tweetSlice';
import CommentItem from './CommentItem';

const CommentSection = ({ tweetId }) => {
  
  const [commentText, setCommentText] = useState('');
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.tweet);
  const [anchorEl, setAnchorEl] = useState(null);

  const openEmojiPicker = (e) => setAnchorEl(e.currentTarget);
  const closeEmojiPicker = () => setAnchorEl(null);
  const onEmojiClick = (emojiData) => setCommentText(prev => prev + emojiData.emoji);


  const handleAddComment = () => {
    if (!commentText.trim()) return;
    dispatch(postComment({ tweetId, content: commentText }));
    setCommentText('');
    dispatch(fetchComments(tweetId));
  };

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        placeholder='Post your reply'
        multiline
        fullWidth
        rows={3}
        variant="standard"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        InputProps={{ disableUnderline: true }}
      />
      <Box display="flex" justifyContent="space-between" mt={1}>
        <Box>
          <IconButton><BrokenImageOutlined color='primary' /></IconButton>
          <IconButton><GifBoxOutlined color='primary' /></IconButton>
          <IconButton size="small" onClick={openEmojiPicker} sx={{ color: '#1da1f2' }}>
            <EmojiIcon fontSize="small" />
          </IconButton>
          <IconButton><FmdGoodOutlined color='primary' /></IconButton>
        </Box>
        <Button
          variant="contained"
          sx={{ borderRadius: 5, fontSize: 10, fontWeight: 900, bgcolor: 'black' }}
          onClick={handleAddComment}
          disabled={!commentText.trim()}
        >
          Reply
        </Button>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Replies</Typography>
        {comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} />
        ))}
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={closeEmojiPicker}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <EmojiPicker onEmojiClick={onEmojiClick} />
      </Popover>
    </Box>
  );
};

export default CommentSection;
