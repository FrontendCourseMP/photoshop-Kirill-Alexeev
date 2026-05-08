import React, { useState, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ImageModel } from '@entities/image/model';
import { InputLevelsSliders } from './InputLevelsSliders';
import { Histogram } from './Histogram';
import { useLevelsState } from '@shared/hooks/useLevelsState';
import { ChannelSelect } from './ui/ChannelSelect';
import { PreviewCheckbox } from './ui/PreviewCheckbox';
import { LogarithmicCheckbox } from './ui/LogarithmicCheckbox';
import { LevelsActions } from './ui/LevelsActions';

interface LevelsDialogProps {
    open: boolean;
    imageModel: ImageModel;
    onApply: (newImageData: ImageData) => void;
    onClose: () => void;
}

const dialogSx = {
    '& .MuiDialog-container': {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingLeft: '60px',
        paddingTop: '80px',
        pointerEvents: 'none',
    },
    '& .MuiPaper-root': {
        pointerEvents: 'auto',
        width: '420px',
        maxHeight: 'calc(100vh - 120px)',
        overflow: 'auto',
        borderRadius: 2,
        boxShadow: 6,
        margin: 0,
    },
};

export const LevelsDialog: React.FC<LevelsDialogProps> = ({ open, imageModel, onApply, onClose }) => {
    const channels = imageModel.channels;
    const availableChannels = useMemo(() => {
        const list: string[] = ['master'];
        channels.forEach(ch => {
            if (['R', 'G', 'B', 'A', 'Alpha', 'Gray'].includes(ch)) list.push(ch);
        });
        return list;
    }, [channels]);

    const [logarithmic, setLogarithmic] = useState(false);

    const {
        activeChannel,
        setActiveChannel,
        current,
        previewEnabled,
        setPreviewEnabled,
        handleChange,
        handleReset,
        handleApply,
        handleCancel,
        maxValue,
    } = useLevelsState(open, imageModel, availableChannels, (newData) => {
        onApply(newData);
        onClose();
    });

    const onDialogCancel = () => {
        handleCancel();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onDialogCancel} maxWidth={false}
            hideBackdrop disableScrollLock disableEnforceFocus disableAutoFocus disableRestoreFocus
            sx={dialogSx}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, px: 2 }}>
                <Typography variant="subtitle1">Уровни</Typography>
                <IconButton size="small" onClick={onDialogCancel}>
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 2, pt: 1, overflow: 'initial' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <ChannelSelect value={activeChannel} onChange={setActiveChannel} channels={availableChannels} />

                    <Histogram imageData={imageModel.imageData} channel={activeChannel} maxValue={maxValue} logarithmic={logarithmic} />

                    <LogarithmicCheckbox checked={logarithmic} onChange={setLogarithmic} />

                    <InputLevelsSliders black={current.black} white={current.white} gamma={current.gamma} maxValue={maxValue} onChange={handleChange} />

                    <PreviewCheckbox checked={previewEnabled} onChange={setPreviewEnabled} />
                </Box>
            </DialogContent>

            <LevelsActions onReset={handleReset} onCancel={onDialogCancel} onApply={handleApply} />
        </Dialog>
    );
};