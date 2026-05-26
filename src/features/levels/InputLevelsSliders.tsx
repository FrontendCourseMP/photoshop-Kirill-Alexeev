import React, { useState, useEffect } from 'react';
import { Box, Typography, Slider } from '@mui/material';

interface SlidersProps {
    black: number;
    white: number;
    gamma: number;
    maxValue: number;
    onChangeCommitted: (black: number, white: number, gamma: number) => void;
}

export const InputLevelsSliders: React.FC<SlidersProps> = ({
    black: initialBlack,
    white: initialWhite,
    gamma: initialGamma,
    maxValue,
    onChangeCommitted,
}) => {
    const [black, setBlack] = useState(initialBlack);
    const [white, setWhite] = useState(initialWhite);
    const [gamma, setGamma] = useState(initialGamma);

    useEffect(() => {
        setBlack(initialBlack);
        setWhite(initialWhite);
        setGamma(initialGamma);
    }, [initialBlack, initialWhite, initialGamma]);

    const handleBlackChange = (_: any, value: number | number[]) => {
        const newBlack = Math.min(value as number, white - 1);
        setBlack(newBlack);
    };

    const handleWhiteChange = (_: any, value: number | number[]) => {
        const newWhite = Math.max(value as number, black + 1);
        setWhite(newWhite);
    };

    const handleGammaChange = (_: any, value: number | number[]) => {
        setGamma(value as number);
    };

    const handleBlackCommitted = (_: any, value: number | number[]) => {
        const newBlack = Math.min(value as number, white - 1);
        onChangeCommitted(newBlack, white, gamma);
    };

    const handleWhiteCommitted = (_: any, value: number | number[]) => {
        const newWhite = Math.max(value as number, black + 1);
        onChangeCommitted(black, newWhite, gamma);
    };

    const handleGammaCommitted = (_: any, value: number | number[]) => {
        onChangeCommitted(black, white, value as number);
    };

    return (
        <Box sx={{ px: 2 }}>
            <Typography variant="caption">Точка чёрного: {black}</Typography>
            <Slider
                value={black}
                min={0}
                max={maxValue}
                step={1}
                onChange={handleBlackChange}
                onChangeCommitted={handleBlackCommitted}
                valueLabelDisplay="auto"
                sx={{
                    color: 'primary.main',
                    '& .MuiSlider-thumb': {
                        backgroundColor: '#fff',
                        border: '2px solid currentColor',
                    },
                }}
            />
            <Typography variant="caption">Точка белого: {white}</Typography>
            <Slider
                value={white}
                min={0}
                max={maxValue}
                step={1}
                onChange={handleWhiteChange}
                onChangeCommitted={handleWhiteCommitted}
                valueLabelDisplay="auto"
                sx={{
                    color: 'primary.main',
                    '& .MuiSlider-thumb': {
                        backgroundColor: '#fff',
                        border: '2px solid currentColor',
                    },
                }}
            />
            <Typography variant="caption">Гамма: {gamma.toFixed(2)}</Typography>
            <Slider
                value={gamma}
                min={0.1}
                max={9.9}
                step={0.01}
                onChange={handleGammaChange}
                onChangeCommitted={handleGammaCommitted}
                valueLabelDisplay="auto"
                sx={{
                    color: 'primary.main',
                    '& .MuiSlider-thumb': {
                        backgroundColor: '#fff',
                        border: '2px solid currentColor',
                    },
                }}
            />
        </Box>
    );
};