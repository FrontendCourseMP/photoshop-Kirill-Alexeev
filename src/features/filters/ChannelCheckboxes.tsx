import React from 'react';
import { FormControlLabel, Checkbox, Typography } from '@mui/material';

interface ChannelCheckboxesProps {
    channels: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

export const ChannelCheckboxes: React.FC<ChannelCheckboxesProps> = ({ channels, selected, onChange }) => {
    const toggle = (ch: string) => {
        if (selected.includes(ch)) {
            onChange(selected.filter(c => c !== ch));
        } else {
            onChange([...selected, ch]);
        }
    };

    return (
        <div>
            {channels.map(ch => (
                <FormControlLabel
                    key={ch}
                    control={
                        <Checkbox
                            size="small"
                            checked={selected.includes(ch)}
                            onChange={() => toggle(ch)}
                            sx={{
                                color: '#bdbdbd',
                                '&.Mui-checked': { color: '#ffffff' },
                            }}
                        />
                    }
                    label={<Typography variant="caption">{ch}</Typography>}
                />
            ))}
        </div>
    );
};