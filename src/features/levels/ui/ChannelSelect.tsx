// src/features/levels/ui/ChannelSelect.tsx
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface Props {
    value: string;
    onChange: (val: string) => void;
    channels: string[];
}

const lightSelectStyles = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#e0e0e0',
        },
        '&:hover fieldset': {
            borderColor: '#bdbdbd',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#90caf9',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#9e9e9e',
        '&.Mui-focused': {
            color: '#90caf9',
        },
    },
};

export const ChannelSelect: React.FC<Props> = ({ value, onChange, channels }) => (
    <FormControl size="small" fullWidth sx={lightSelectStyles}>
        <InputLabel>Канал</InputLabel>
        <Select value={value} label="Канал" onChange={e => onChange(e.target.value)}>
            {channels.map(ch => (
                <MenuItem key={ch} value={ch}>
                    {ch === 'master' ? 'Master (RGB)' : ch}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
);