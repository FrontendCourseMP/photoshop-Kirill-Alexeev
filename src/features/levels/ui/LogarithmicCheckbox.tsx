import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

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
                onChange={(e) => onChange(e.target.checked)}
                sx={{
                    color: 'grey.300',
                    '&.Mui-checked': {
                        color: 'grey.300',
                    },
                }}
            />
        }
        label="Логарифмическая"
    />
);