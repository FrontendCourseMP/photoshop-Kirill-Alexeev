// src/features/levels/LevelsDialog.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Checkbox, FormControlLabel, Select, MenuItem,
    Box, FormControl, InputLabel, IconButton, Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ImageModel } from '@entities/image/model';
import { InputLevelsSliders } from './InputLevelsSliders';
import { Histogram } from './Histogram';
import { applyLevelsToImageData } from '@shared/lib/utils/applyLevels';
import { useEditorStore } from '@app/store/editorStore';

interface LevelsDialogProps {
    open: boolean;
    imageModel: ImageModel;
    onApply: (newImageData: ImageData) => void;
    onClose: () => void;
}

const defaultLevels = (max: number) => ({ black: 0, white: max, gamma: 1.0 });

export const LevelsDialog: React.FC<LevelsDialogProps> = ({ open, imageModel, onApply, onClose }) => {
    const maxValue = imageModel.metadata.colorDepth === 7 ? 127 : 255;
    const channels = imageModel.channels;
    const availableChannels = useMemo(() => {
        const list: string[] = ['master'];
        channels.forEach(ch => {
            if (['R', 'G', 'B', 'A', 'Alpha', 'Gray'].includes(ch)) list.push(ch);
        });
        return list;
    }, [channels]);

    const [activeChannel, setActiveChannel] = useState('master');
    const [levels, setLevels] = useState<Record<string, { black: number; white: number; gamma: number }>>({});
    const [previewEnabled, setPreviewEnabled] = useState(true);
    const [logarithmic, setLogarithmic] = useState(false);
    const { setLevelsPreview, clearLevelsPreview } = useEditorStore();

    // Инициализация при открытии
    useEffect(() => {
        if (!open) return;
        const init: Record<string, any> = {};
        availableChannels.forEach(ch => {
            init[ch] = levels[ch] ?? defaultLevels(maxValue);
        });
        setLevels(init);
        setActiveChannel('master');
        setPreviewEnabled(true);
    }, [open, maxValue, availableChannels]);

    // Предпросмотр
    useEffect(() => {
        if (!open) return;
        if (previewEnabled && levels[activeChannel]) {
            setLevelsPreview({
                channel: activeChannel,
                levels: levels[activeChannel],
                maxValue,
            });
        } else {
            clearLevelsPreview();
        }
    }, [previewEnabled, levels, activeChannel, open, maxValue, setLevelsPreview, clearLevelsPreview]);

    const current = levels[activeChannel] ?? defaultLevels(maxValue);

    const handleChange = (black: number, white: number, gamma: number) => {
        setLevels(prev => ({
            ...prev,
            [activeChannel]: { black, white, gamma },
        }));
    };

    const handleReset = () => {
        setLevels(prev => ({
            ...prev,
            [activeChannel]: defaultLevels(maxValue),
        }));
    };

    const handleApply = () => {
        let result = imageModel.imageData;
        const ordered = availableChannels.filter(ch => ch !== 'master');
        ordered.forEach(ch => {
            if (levels[ch]) {
                result = applyLevelsToImageData(result, ch, levels[ch], maxValue);
            }
        });
        if (levels['master']) {
            result = applyLevelsToImageData(result, 'master', levels['master'], maxValue);
        }
        clearLevelsPreview();
        onApply(result);
    };

    const handleCancel = () => {
        clearLevelsPreview();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            maxWidth={false}
            hideBackdrop
            disableScrollLock
            disableEnforceFocus
            disableAutoFocus
            disableRestoreFocus
            sx={{
                '& .MuiDialog-container': {
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    paddingLeft: '60px',    // отступ от левой панели инструментов
                    paddingTop: '80px',     // ниже AppBar
                    pointerEvents: 'none',  // клики проходят сквозь контейнер
                },
                '& .MuiPaper-root': {
                    pointerEvents: 'auto',  // сам диалог кликабелен
                    width: '420px',
                    maxHeight: 'calc(100vh - 120px)',
                    overflow: 'auto',
                    borderRadius: 2,
                    boxShadow: 6,
                    margin: 0,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    px: 2,
                    userSelect: 'none',
                }}
            >
                <Typography variant="subtitle1">Уровни</Typography>
                <IconButton size="small" onClick={handleCancel}>
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 2, pt: 1, overflow: 'initial' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <FormControl size="small" fullWidth>
                        <InputLabel>Канал</InputLabel>
                        <Select
                            value={activeChannel}
                            label="Канал"
                            onChange={(e) => setActiveChannel(e.target.value)}
                        >
                            {availableChannels.map(ch => (
                                <MenuItem key={ch} value={ch}>
                                    {ch === 'master' ? 'Master (RGB)' : ch}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Histogram
                        imageData={imageModel.imageData}
                        channel={activeChannel}
                        maxValue={maxValue}
                        logarithmic={logarithmic}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={logarithmic}
                                onChange={(e) => setLogarithmic(e.target.checked)}
                                sx={{
                                    color: 'primary.light',
                                    '&.Mui-checked': { color: 'primary.main' },
                                }}
                            />
                        }
                        label={<Typography variant="caption">Логарифмическая</Typography>}
                    />

                    <InputLevelsSliders
                        black={current.black}
                        white={current.white}
                        gamma={current.gamma}
                        maxValue={maxValue}
                        onChange={handleChange}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={previewEnabled}
                                onChange={(e) => setPreviewEnabled(e.target.checked)}
                                sx={{
                                    color: 'primary.light',
                                    '&.Mui-checked': { color: 'primary.main' },
                                }}
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
                    <Button onClick={handleCancel} size="small" color="inherit" sx={{ mr: 1, textTransform: 'none' }}>
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