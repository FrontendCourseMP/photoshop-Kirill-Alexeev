import React from 'react';
import { DialogActions, Button, Box } from '@mui/material';

interface Props {
    onReset: () => void;
    onCancel: () => void;
    onApply: () => void;
}

export const LevelsActions: React.FC<Props> = ({ onReset, onCancel, onApply }) => (
    <DialogActions sx={{ px: 2, pb: 1.5, justifyContent: 'space-between' }}>
        <Button onClick={onReset} size="small" variant="outlined" color="inherit" sx={{ textTransform: 'none' }}>
            Сброс
        </Button>
        <Box>
            <Button onClick={onCancel} size="small" color="inherit" sx={{ mr: 1, textTransform: 'none' }}>
                Отмена
            </Button>
            <Button variant="contained" size="small" onClick={onApply} sx={{ textTransform: 'none' }}>
                Применить
            </Button>
        </Box>
    </DialogActions>
);