import React, { useState } from 'react';
import {
  Box, Avatar, IconButton, Button, Popover, InputBase
} from '@mui/material';
import {
  BrokenImageOutlined as ImageIcon,
  GifBoxOutlined as GifIcon,
  SentimentSatisfiedOutlined as EmojiIcon,
  FmdGoodOutlined as LocationIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';
import EmojiPicker from 'emoji-picker-react';

const TweetInputBox = ({ onTweet }) => {
  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleImageChange = (e) => setNewImage(e.target.files[0]);
  const openEmojiPicker = (e) => setAnchorEl(e.currentTarget);
  const closeEmojiPicker = () => setAnchorEl(null);
  const onEmojiClick = (emojiData) => setNewContent(prev => prev + emojiData.emoji);

  const handleSubmit = () => {
    onTweet(newContent, newImage);
    setNewContent('');
    setNewImage(null);
  };

  return (
    <Box sx={{
      display: 'flex',
      px: 2,
      pt: 1.5,
      pb: 1,
      borderBottom: '1px solid #e6ecf0',
      bgcolor: 'white',
    }}>
      <Avatar src="/avatar.png" sx={{ width: 48, height: 48, mr: 2 }} />
      <Box sx={{ flexGrow: 1 }}>
        <InputBase
          placeholder="What’s happening?"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          multiline
          fullWidth
          sx={{
            fontSize: 18,
            mb: 1,
            '& textarea': {
              padding: 0,
              lineHeight: 1.4,
            },
          }}
        />

        {newImage && (
          <Box sx={{ my: 1 }}>
            <img
              src={URL.createObjectURL(newImage)}
              alt="preview"
              style={{
                width: '100%',
                maxHeight: 300,
                objectFit: 'contain',
                borderRadius: 12,
              }}
            />
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <Box display="flex" gap={0.5}>
            <input
              type="file"
              accept="image/*"
              id="upload-image"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <label htmlFor="upload-image">
              <IconButton size="small" component="span" sx={{ color: '#1da1f2' }}>
                <ImageIcon fontSize="small" />
              </IconButton>
            </label>
            <IconButton size="small" sx={{ color: '#1da1f2' }}>
              <GifIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={openEmojiPicker} sx={{ color: '#1da1f2' }}>
              <EmojiIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: '#1da1f2' }}>
              <LocationIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: '#1da1f2' }}>
              <LocationOnIcon fontSize="small" />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            disabled={!newContent.trim() && !newImage}
            onClick={handleSubmit}
            sx={{
              textTransform: 'none',
              borderRadius: '9999px',
              fontWeight: 'bold',
              bgcolor: '#1da1f2',
              '&:hover': { bgcolor: '#1a91da' },
            }}
          >
            Post
          </Button>
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
    </Box>
  );
};

export default TweetInputBox;
