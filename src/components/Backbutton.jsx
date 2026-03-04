import React from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <IconButton onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIcon />
        </IconButton>
    );
};

export default BackButton;
