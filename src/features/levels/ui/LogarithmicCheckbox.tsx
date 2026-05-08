import React from 'react';
import { FormControlLabel, Checkbox, Typography } from '@mui/material';

interface Props {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const LogarithmicCheckbox: React.FC<Props> = ({ checked, onChange }) => (
    <FormControlLabel
        control={
            <Checkbox
                size="small"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                sx={{ color: 'primary.light', '&.Mui-checked': { color: 'primary.main' } }}
            />
        }
        label={<Typography variant="caption">Логарифмическая</Typography>}
    />
);