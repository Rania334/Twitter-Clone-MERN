import React from 'react';
import { Card, CardContent, Typography, Avatar, CardHeader } from '@mui/material';

export default function TweetCard({ tweet }) {
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardHeader
        avatar={<Avatar>{tweet.username[0]}</Avatar>}
        title={tweet.username}
        subheader={new Date(tweet.createdAt).toLocaleString()}
      />
      <CardContent>
        <Typography variant="body1">{tweet.content}</Typography>
      </CardContent>
    </Card>
  );
}
