import React, { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { IconButton } from '@mui/material';
import './LikeButton.css'
const LikeButton = ({ liked, onClick }) => {
    const [showBubbles, setShowBubbles] = useState(false);

    const handleClick = (e) => {
        e.stopPropagation();
        setShowBubbles(true);
        onClick(e);
        setTimeout(() => setShowBubbles(false), 600);
    };

    const colors = ['#ff1744', '#f50057', '#e040fb', '#7c4dff', '#18ffff'];

    return (
        <div className="like-container">
            <IconButton onClick={handleClick}>
                {liked ?  <FavoriteIcon sx={{color:'#F91880', fontSize:"5"}} /> : <FavoriteBorderIcon />}
            </IconButton>

            {showBubbles &&
                colors.map((color, idx) => {
                    const angle = (idx / colors.length) * 2 * Math.PI;
                    const x = Math.cos(angle) * 20 + 'px';
                    const y = Math.sin(angle) * -20 + 'px';

                    return (
                        <span
                            key={idx}
                            className="like-bubble"
                            style={{
                                backgroundColor: color,
                                animationDelay: `${idx * 0.05}s`,
                                '--x': x,
                                '--y': y,
                            }}
                        />
                    );
                })}

        </div>
    );
};

export default LikeButton;
