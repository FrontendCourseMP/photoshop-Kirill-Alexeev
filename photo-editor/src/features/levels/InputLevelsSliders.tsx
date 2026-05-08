import React from 'react';
import { Box, Typography, Slider } from '@mui/material';

interface SlidersProps {
    black: number;
    white: number;
    gamma: number;
    maxValue: number;
    onChange: (black: number, white: number, gamma: number) => void;
}

export const InputLevelsSliders: React.FC<SlidersProps> = ({ black, white, gamma, maxValue, onChange }) => {
    const handleBlack = (_: any, val: number | number[]) => {
        const newBlack = Math.min(val as number, white - 1);
        onChange(newBlack, white, gamma);
    };
    const handleWhite = (_: any, val: number | number[]) => {
        const newWhite = Math.max(val as number, black + 1);
        onChange(black, newWhite, gamma);
    };
    const handleGamma = (_: any, val: number | number[]) => {
        onChange(black, white, val as number);
    };

    return (
        <Box sx={{ px: 2 }}>
            <Typography variant="caption">Точка чёрного: {black}</Typography>
            <Slider value={black} min={0} max={maxValue} step={1} onChange={handleBlack} valueLabelDisplay="auto" sx={{
                color: 'primary.main', // цвет трека и ползунка
                '& .MuiSlider-thumb': {
                    backgroundColor: '#fff',
                    border: '2px solid currentColor',
                },
            }} />
            <Typography variant="caption">Точка белого: {white}</Typography>
            <Slider value={white} min={0} max={maxValue} step={1} onChange={handleWhite} valueLabelDisplay="auto" sx={{
                color: 'primary.main', // цвет трека и ползунка
                '& .MuiSlider-thumb': {
                    backgroundColor: '#fff',
                    border: '2px solid currentColor',
                },
            }} />
            <Typography variant="caption">Гамма: {gamma.toFixed(2)}</Typography>
            <Slider value={gamma} min={0.1} max={9.9} step={0.01} onChange={handleGamma} valueLabelDisplay="auto" sx={{
                color: 'primary.main', // цвет трека и ползунка
                '& .MuiSlider-thumb': {
                    backgroundColor: '#fff',
                    border: '2px solid currentColor',
                },
            }} />
        </Box>
    );
};