// Components/HomePage/TweetSkeleton.js
import React from 'react';
import { Card, CardContent, Skeleton, Box } from '@mui/material';

const TweetSkeleton = () => (
  <Card
    elevation={0}
    sx={{ borderRadius: 0, borderBottom: '1px solid #e6ecf0' }}
  >
    <CardContent>
      <Box display="flex" alignItems="center" mb={1}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box ml={2} flex={1}>
          <Skeleton width="30%" />
          <Skeleton width="50%" />
        </Box>
      </Box>
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="rounded" width="100%" height={200} sx={{ mt: 1, borderRadius: 2 }} />
    </CardContent>
  </Card>
);

export default TweetSkeleton;
