import React from 'react';
import { Box, Typography, Portal } from '@mui/material';
import { keyframes } from '@mui/system';

interface LoaderOverlayProps {
    open: boolean;
    message?: string;
}

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

export const LoaderOverlay: React.FC<LoaderOverlayProps> = ({
    open,
    message = 'Пожалуйста, подождите...',
}) => {
    if (!open) return null;

    return (
        <Portal>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                }}
            >
                <Box
                    sx={{
                        width: 64,
                        height: 64,
                        mb: 2,
                        position: 'relative',
                        animation: `${spin} 1s linear infinite`,
                    }}
                >
                    <Box
                        component="svg"
                        viewBox="22 22 44 44"
                        sx={{
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <Box
                            component="circle"
                            cx="44"
                            cy="44"
                            r="20"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="5"
                            strokeDasharray="80, 200"
                            strokeLinecap="round"
                        />
                    </Box>
                </Box>
                <Typography
                    variant="h6"
                    sx={{
                        color: '#ffffff',
                        textAlign: 'center',
                        textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                    }}
                >
                    {message}
                </Typography>
            </Box>
        </Portal>
    );
};