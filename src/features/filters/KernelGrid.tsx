import React from 'react';
import { Box, TextField } from '@mui/material';

interface KernelGridProps {
    matrix: number[][];
    onChange: (row: number, col: number, value: number) => void;
}

export const KernelGrid: React.FC<KernelGridProps> = ({ matrix, onChange }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {matrix.map((row, ri) => (
            <Box key={ri} sx={{ display: 'flex', gap: 0.5 }}>
                {row.map((val, ci) => (
                    <TextField
                        key={`${ri}-${ci}`}
                        size="small"
                        type="number"
                        value={val}
                        onChange={(e) => onChange(ri, ci, Number(e.target.value))}
                        sx={{ width: 60 }}
                    />
                ))}
            </Box>
        ))}
    </Box>
);