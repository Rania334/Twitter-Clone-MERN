import React, { useState } from 'react';
import {
    Box,
    Button,
    Divider,
    Modal,
    Typography,
    TextField,
    Stack,
    Alert,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import AppleIcon from '@mui/icons-material/Apple';
import GoogleIcon from '@mui/icons-material/Google';
import XIcon from '@mui/icons-material/X';
import RegisterPopup from './RegisterPopup';
import { jwtDecode } from 'jwt-decode';
import VerifyPopup from './VerifyPopup';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 320,
    bgcolor: 'background.paper',
    borderRadius: 5,
    boxShadow: 24,
    px: 13,
    py: 0,
};

const styleBtn = {
    bgcolor: 'background.paper',
    borderRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.23)',
    color: 'rgba(0, 0, 0, 0.78)',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#f5f5f5',
    },
};

const LoginPopup = ({ open, onClose }) => {
    
    const [openVerifyPopup, setOpenVerifyPopup] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [unverifiedEmail, setUnverifiedEmail] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [verifyKey, setVerifyKey] = useState('');  // State to hold the verification key

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setInfoMessage('');
        setUnverifiedEmail('');
        setUnverifiedEmail(email); // Set the email
        setOpenVerifyPopup(true); // Open the VerifyPopup after email set

        try {
            const res = await axios.post(
                '/auth/login',
                { email, password },
                { withCredentials: true }
            );

            const token = res.data.accessToken;
            dispatch(setToken(token));
            const decoded = jwtDecode(token);
            const userRes = await axios.get(`/user/getUser/${decoded.username}`);
            dispatch(setUser(userRes.data));
            navigate('/home');
            onClose();
        } catch (err) {
            const message = err.response?.data?.message;
            if (message === 'Email not verified') {
                setUnverifiedEmail(email);
                setError(message);
            } else {
                setError(message || 'Login failed. Try again.');
            }
        }
    };

    const handleResendVerification = async () => {
        try {
            await axios.post('/auth/resend-verify', { email: unverifiedEmail });
            setInfoMessage('Verification email has been sent. Please check your inbox.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend verification email.');
        }
    };

    const handleVerifyCode = async () => {
        try {
            // Logic to verify the code
            await axios.post('/auth/verify-email', { email: unverifiedEmail,verificationKey: verifyKey });

            // Handle success after verification (e.g., allow login)
            setOpenVerifyPopup(false);
            setInfoMessage('Email verified successfully!');
        } catch (err) {
            setError('Failed to verify email. Please try again.');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box>
                <Box sx={style}>
                    <Box align="center" fontWeight="bold">
                        <XIcon sx={{ fontSize: '35px', p: 4, m: 0 }} />
                    </Box>

                    <Typography variant="h4" align="left" fontWeight="bold">
                        Sign in to X
                    </Typography>

                    <Stack spacing={2} mt={2}>
                        <Button variant="outlined" fullWidth sx={styleBtn}>
                            <GoogleIcon sx={{ pr: 1 }} />
                            Sign in with Google
                        </Button>
                        <Button variant="outlined" fullWidth sx={styleBtn}>
                            <AppleIcon sx={{ pr: 1 }} />
                            Sign in with Apple
                        </Button>

                        <Divider>or</Divider>

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Phone, email, or username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                autoComplete="email"
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                autoComplete="current-password"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    textTransform: 'none',
                                    mt: 1,
                                    borderRadius: 20,
                                }}
                            >
                                Next
                            </Button>
                        </form>

                        {error && <Alert severity="error">{error}</Alert>}
                        {infoMessage && <Alert severity="info">{infoMessage}</Alert>}

                        {unverifiedEmail && (
                            <Button
                                onClick={handleResendVerification}
                                fullWidth
                                sx={{
                                    backgroundColor: 'white',
                                    color: 'black',
                                    textTransform: 'none',
                                    mt: 1,
                                    borderRadius: 20,
                                    border: '1px solid',
                                }}
                            >
                                Resend Verification Email
                            </Button>
                        )}

                        {infoMessage && (
                            <>
                                <TextField
                                    fullWidth
                                    label="Enter verification key"
                                    value={verifyKey}
                                    onChange={(e) => setVerifyKey(e.target.value)}
                                    margin="normal"
                                />
                                <Button
                                    fullWidth
                                    onClick={handleVerifyCode}
                                    sx={{
                                        backgroundColor: 'black',
                                        color: 'white',
                                        textTransform: 'none',
                                        mt: 1,
                                        borderRadius: 20,
                                    }}
                                >
                                    Verify
                                </Button>
                            </>
                        )}

                        <Button
                            fullWidth
                            sx={{
                                backgroundColor: 'white',
                                color: 'black',
                                textTransform: 'none',
                                mt: 1,
                                borderRadius: 20,
                                border: '1px solid',
                            }}
                        >
                            Forgot password?
                        </Button>
                    </Stack>

                    <Box sx={{ p: 4 }}>
                        <Typography sx={{ color: 'rgba(0, 0, 0, 0.5)' }}>
                            Don't have an account?
                            <Button onClick={() => setOpenRegister(true)}>Sign up</Button>
                        </Typography>

                        <RegisterPopup open={openRegister} onClose={() => setOpenRegister(false)} />
                    </Box>
                </Box>
                
            </Box>
        </Modal>
    );
};

export default LoginPopup;
