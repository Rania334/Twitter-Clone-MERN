import React, { useState } from 'react';
import {
  Box, Typography, Avatar, Button, Collapse, TextField, Divider,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { postReply } from '../../features/tweet/tweetSlice';

const CommentItem = ({ comment }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const dispatch = useDispatch();

  const handleAddReply = () => {
    if (!replyText.trim()) return;
    dispatch(postReply({ commentId: comment._id, content: replyText }));
    setReplyText('');
    setShowReplyInput(false);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" alignItems="center" mb={1}>
        {/* <Avatar src={comment.user?.profilePic} sx={{ width: 32, height: 32, mr: 1 }} /> */}
        <Typography fontWeight="bold">{comment.user?.username || 'User'}</Typography>
      </Box>

      <Typography variant="body2" sx={{ ml: 5 }}>{comment.content}</Typography>

      <Button
        size="small"
        onClick={() => setShowReplyInput(!showReplyInput)}
        sx={{ textTransform: 'none', ml: 5 }}
      >
        Reply
      </Button>

      <Collapse in={showReplyInput} sx={{ ml: 5, mt: 1 }}>
        <TextField
          multiline
          fullWidth
          rows={2}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write your reply..."
          sx={{ mb: 1 }}
        />
        <Button size="small" variant="outlined" onClick={handleAddReply}>
          Submit Reply
        </Button>
      </Collapse>

      {comment.replies?.length > 0 && (
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
  );
};

export default CommentItem;
