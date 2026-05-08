import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ImageSaver } from '@features/image-saver/ImageSaver';
import { ImageModel } from '@entities/image/model';

interface AppHeaderProps {
    imageModel: ImageModel | null;
    onClear: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ imageModel, onClear }) => (
    <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                PhotoEditor
            </Typography>
            <Tooltip title="Очистить холст">
                <span>
                    <IconButton color="inherit" onClick={onClear} disabled={!imageModel}>
                        <DeleteIcon />
                    </IconButton>
                </span>
            </Tooltip>
            <ImageSaver imageModel={imageModel} />
        </Toolbar>
    </AppBar>
);