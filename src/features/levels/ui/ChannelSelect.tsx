import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface Props {
    value: string;
    onChange: (val: string) => void;
    channels: string[];
}

export const ChannelSelect: React.FC<Props> = ({ value, onChange, channels }) => (
    <FormControl size="small" fullWidth>
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