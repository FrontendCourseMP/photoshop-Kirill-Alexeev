import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Checkbox, FormControlLabel, Box, Typography, IconButton,
    Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ImageModel } from '@entities/image/model';
import { KernelGrid } from './KernelGrid';
import { ChannelCheckboxes } from './ChannelCheckboxes';
import { EdgeHandlingSelect } from './EdgeHandlingSelect';
import { predefinedKernels } from '@shared/lib/utils/predefinedKernels';
import { convolveAsync, EdgeHandling } from '@shared/lib/utils/convolve';
import { useEditorStore } from '@app/store/editorStore';

interface FilterDialogProps {
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

const lightSelectStyles = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: '#e0e0e0' },
        '&:hover fieldset': { borderColor: '#bdbdbd' },
        '&.Mui-focused fieldset': { borderColor: '#90caf9' },
    },
    '& .MuiInputLabel-root': {
        color: '#9e9e9e',
        '&.Mui-focused': { color: '#90caf9' },
    },
};

const lightCheckboxStyles = {
    color: '#bdbdbd',
    '&.Mui-checked': { color: '#ffffff' },
};

export const FilterDialog: React.FC<FilterDialogProps> = ({ open, imageModel, onApply, onClose }) => {
    const isGrayBit7 = imageModel.metadata.format === 'gb7';

    const availableChannels = useMemo(() => {
        return isGrayBit7 ? ['Gray'] : ['R', 'G', 'B'];
    }, [isGrayBit7]);

    const [kernel, setKernel] = useState<number[][]>(predefinedKernels[0].matrix);
    const [kernelPreset, setKernelPreset] = useState<string>(predefinedKernels[0].name);
    const [selectedChannels, setSelectedChannels] = useState<string[]>(
        isGrayBit7 ? ['Gray'] : ['R', 'G', 'B']
    );
    const [edge, setEdge] = useState<EdgeHandling>('copy');
    const [previewEnabled, setPreviewEnabled] = useState(true);

    const { setFilterPreview, clearFilterPreview } = useEditorStore();
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            clearFilterPreview();
        };
    }, []);

    useEffect(() => {
        if (!open) {
            clearFilterPreview();
        }
    }, [open]);

    const requestPreview = useCallback(() => {
        if (!open || !previewEnabled) {
            clearFilterPreview();
            return;
        }
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(async () => {
            try {
                const result = await convolveAsync(imageModel.imageData, kernel, selectedChannels, edge);
                setFilterPreview(result);
            } catch (err) {
                console.error('Filter preview error:', err);
            }
        }, 100);
    }, [open, previewEnabled, imageModel, kernel, selectedChannels, edge, setFilterPreview, clearFilterPreview]);

    useEffect(() => {
        requestPreview();
    }, [requestPreview]);

    const handlePresetChange = (name: string) => {
        const preset = predefinedKernels.find(k => k.name === name);
        if (preset) {
            setKernelPreset(name);
            setKernel(preset.matrix);
        }
    };

    const handleKernelChange = (row: number, col: number, value: number) => {
        const newMatrix = kernel.map(r => [...r]);
        newMatrix[row][col] = value;
        setKernel(newMatrix);
        const match = predefinedKernels.find(k =>
            k.matrix.every((r, ri) => r.every((val, ci) => newMatrix[ri][ci] === val))
        );
        setKernelPreset(match ? match.name : 'Пользовательский');
    };

    const handleApply = async () => {
        const channelsToApply = isGrayBit7 ? ['Gray'] : selectedChannels;
        const result = await convolveAsync(imageModel.imageData, kernel, channelsToApply, edge);
        clearFilterPreview();
        onApply(result);
        onClose();
    };

    const handleReset = () => {
        setKernel(predefinedKernels[0].matrix);
        setKernelPreset(predefinedKernels[0].name);
        setSelectedChannels(isGrayBit7 ? ['Gray'] : ['R', 'G', 'B']);
    };

    const handleClose = () => {
        clearFilterPreview();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth={false}
            hideBackdrop disableScrollLock disableEnforceFocus disableAutoFocus disableRestoreFocus
            sx={dialogSx}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, px: 2 }}>
                <Typography variant="subtitle1">Фильтры</Typography>
                <IconButton size="small" onClick={handleClose}>
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 2, pt: 1, overflow: 'initial' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <FormControl size="small" fullWidth sx={lightSelectStyles}>
                        <InputLabel>Ядро</InputLabel>
                        <Select
                            value={kernelPreset}
                            label="Ядро"
                            onChange={(e) => handlePresetChange(e.target.value)}
                        >
                            {predefinedKernels.map(k => (
                                <MenuItem key={k.name} value={k.name}>{k.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <KernelGrid matrix={kernel} onChange={handleKernelChange} />

                    {!isGrayBit7 && (
                        <>
                            <Typography variant="caption">Применить к каналам:</Typography>
                            <ChannelCheckboxes
                                channels={availableChannels}
                                selected={selectedChannels}
                                onChange={setSelectedChannels}
                            />
                        </>
                    )}

                    <EdgeHandlingSelect value={edge} onChange={setEdge} />

                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={previewEnabled}
                                onChange={(e) => setPreviewEnabled(e.target.checked)}
                                sx={lightCheckboxStyles}
                            />
                        }
                        label={<Typography variant="caption">Предпросмотр</Typography>}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 2, pb: 1.5, justifyContent: 'space-between' }}>
                <Button onClick={handleReset} size="small" variant="outlined" color="inherit" sx={{ textTransform: 'none' }}>
                    Сброс
                </Button>
                <Box>
                    <Button onClick={handleClose} size="small" color="inherit" sx={{ mr: 1, textTransform: 'none' }}>
                        Отмена
                    </Button>
                    <Button variant="contained" size="small" onClick={handleApply} sx={{ textTransform: 'none' }}>
                        Применить
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};