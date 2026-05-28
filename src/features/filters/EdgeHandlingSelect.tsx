import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { EdgeHandling } from '@shared/lib/utils/convolve';

interface Props {
    value: EdgeHandling;
    onChange: (val: EdgeHandling) => void;
}

export const EdgeHandlingSelect: React.FC<Props> = ({ value, onChange }) => (
    <FormControl size="small" fullWidth>
        <InputLabel>Заполнение краёв</InputLabel>
        <Select value={value} label="Заполнение краёв" onChange={(e) => onChange(e.target.value as EdgeHandling)}>
            <MenuItem value="black">Чёрный</MenuItem>
            <MenuItem value="white">Белый</MenuItem>
            <MenuItem value="copy">Копировать</MenuItem>
        </Select>
    </FormControl>
);