import React, { useState } from 'react';
import { Box, Typography, Avatar, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TweetHeader = ({ tweet }) => {
  const navigate = useNavigate();

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Box sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" mb={1}>
        <Box
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${tweet.user?.username}`);
          }}
          sx={{ mr: 1, cursor: 'pointer' }}
        >
          <Avatar src={tweet.user?.profilePic || ""} sx={{ width: 40, height: 40 }} />
        </Box>
        <Box>
          <Typography fontWeight="bold">{tweet.user.name}</Typography>
          <Typography variant="body2" color="text.secondary">@{tweet.user.username}</Typography>
        </Box>
      </Box>
      <Typography variant="body1" sx={{ mb: 2 }}>{tweet.content}</Typography>
      {tweet.img && (
        <Box sx={{ mb: 2 }}>
          {!imageLoaded && <Skeleton variant="rectangular" width="100%" height={300} />}
          <Box
            component="img"
            src={tweet.img}
            alt="Tweet"
            onLoad={() => setImageLoaded(true)}
            sx={{
              display: imageLoaded ? 'block' : 'none',
              width: '100%',
              borderRadius: 2,
              maxHeight: 500,
              objectFit: 'cover',
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default TweetHeader;
