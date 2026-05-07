import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemText, Tooltip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { ImageModel } from '@entities/image/model';
import { ImageFormat } from '@shared/types';
import { saveImage } from '@shared/lib/utils/saver';

interface ImageSaverProps {
    imageModel: ImageModel | null;
}

export const ImageSaver: React.FC<ImageSaverProps> = ({ imageModel }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSave = (format: ImageFormat) => {
        if (imageModel) {
            saveImage(imageModel, format);
        }
        handleClose();
    };

    return (
        <>
            <Tooltip title="Сохранить как...">
                <span>
                    <IconButton
                        color="inherit"
                        onClick={handleClick}
                        disabled={!imageModel}
                        aria-controls={open ? 'save-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <SaveIcon />
                    </IconButton>
                </span>
            </Tooltip>
            <Menu
                id="save-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleSave('png')}>
                    <ListItemText>PNG</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleSave('jpeg')}>
                    <ListItemText>JPEG</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleSave('gb7')}>
                    <ListItemText>GB7 (GrayBit-7)</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};