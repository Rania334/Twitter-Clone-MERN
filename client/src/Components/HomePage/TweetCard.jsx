import React, { useState } from 'react';
import MyIcon from '../../assets/MyIcon';
import Retweet from '../../assets/retweet';
import './TweetCard.css';

import {
    Card, CardContent, Box, Avatar, Typography, IconButton, Skeleton
} from '@mui/material';
import {
    MoreHoriz, ChatBubbleOutline, BarChart, Share,
    Repeat as RepeatIcon,
    RepeatOutlined as RepeatOutlinedIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LikeButton from './LikeButton';

const TweetCard = ({ tweet, userId, onLike, onRetweet }) => {
    const navigate = useNavigate();
    const liked = tweet.likes.includes(userId);
    const retweeted = tweet.retweets.includes(userId);
    const [imageLoaded, setImageLoaded] = useState(false);



    const formatTweetDate = (isoDate) => {
        const date = new Date(isoDate);
        const now = new Date();
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const showYear = year !== now.getFullYear();

        return `${month} ${day}${showYear ? `, ${year}` : ''}`;
    };

    return (
        <Card
            sx={{
                borderRadius: 0,
                borderBottom: '1px solid #e6ecf0',
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                    transition: 'background-color 0.4s ease',
                },
            }}
            elevation={0}
            onClick={() => navigate(`/tweet/${tweet._id}`, { state: { tweet } })}
        >
            <CardContent sx={{ pb: 1 }}>
                {tweet.isRetweet && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 6, mb: 0.5, display: 'flex', alignItems: 'center' }}
                    >
                        <RepeatIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Retweeted
                    </Typography>
                )}

                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box display="flex">
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
                            <Typography
                                variant="body1"
                                fontWeight="bold"
                                sx={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/profile/${tweet.user?.username}`);
                                }}
                            >
                                {tweet.user?.name}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                @{tweet.user?.username} · {formatTweetDate(tweet.createdAt)}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                        <MoreHoriz />
                    </IconButton>
                </Box>

                {/* Text Content */}
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mt: 1 }}>
                    {tweet.content}
                </Typography>



                {/* Image with Placeholder */}
                {tweet.img && (
                    <Box mt={1}>
                        {!imageLoaded && (
                            <Skeleton variant="rounded" width="100%" height={250} sx={{ borderRadius: 2 }} />
                        )}
                        <img
                            src={tweet.img}
                            alt="tweet"
                            onLoad={() => setImageLoaded(true)}
                            style={{
                                display: imageLoaded ? 'block' : 'none',
                                width: '100%',
                                borderRadius: '16px',
                                marginTop: 8,
                            }}
                        />
                    </Box>
                )}


                {/* Icons */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} px={1}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                            <MyIcon className="CommentIcon" />
                        </IconButton>
                        <Typography variant="caption">{tweet.comments.length}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={0.5}>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRetweet(tweet._id);
                            }}
                        >
                            {retweeted ? (
                                <Retweet fill="#00BA7C" className="RetweetIcon" />
                            ) : (
                                <Retweet fill="gray" className="RetweetIcon" />
                            )}
                        </IconButton>
                        <Typography variant="caption">{tweet.retweets.length}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={0.5}>
                        <LikeButton
                            liked={liked}
                            onClick={(e) => {
                                e.stopPropagation();
                                onLike(tweet._id);
                            }}
                        />
                        <Typography variant="caption">{tweet.likes.length}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={0.5}>
                        <BarChart fontSize="small" />
                        <Typography variant="caption">4.6M</Typography>
                    </Box>


                    <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                        <Share fontSize="small" />
                    </IconButton>
                </Box>
            </CardContent>


        </Card>
    );
};

export default TweetCard;
