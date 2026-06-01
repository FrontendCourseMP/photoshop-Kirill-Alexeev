import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { EdgeHandling } from '@shared/lib/utils/convolve';

const lightSelectStyles = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: '#e0e0e0' },
        '&:hover fieldset': { borderColor: '#bdbdbd' },
        '&.Mui-focused fieldset': { borderColor: '#90caf9' },
    },
    '& .MuiInputLabel-root': {
        color: '#9e9e9e',
        '&.Mui-focused': { color: '#90caf9' },
    },
};

interface Props {
    value: EdgeHandling;
    onChange: (val: EdgeHandling) => void;
}

export const EdgeHandlingSelect: React.FC<Props> = ({ value, onChange }) => (
    <FormControl size="small" fullWidth sx={lightSelectStyles}>
        <InputLabel>Заполнение краёв</InputLabel>
        <Select value={value} label="Заполнение краёв" onChange={(e) => onChange(e.target.value as EdgeHandling)}>
            <MenuItem value="black">Чёрный</MenuItem>
            <MenuItem value="white">Белый</MenuItem>
            <MenuItem value="copy">Копировать</MenuItem>
        </Select>
    </FormControl>
);