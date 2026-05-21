import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, FormControl, InputLabel, Select,
    MenuItem, Checkbox, FormControlLabel, Typography,
    Tooltip, Box, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { resample, InterpolationMethod } from '@shared/lib/utils/interpolation';
import { ImageModel } from '@entities/image/model';
import { useEditorStore } from '@app/store/editorStore';

interface ResizeDialogProps {
    open: boolean;
    imageModel: ImageModel;
    onResized: (newModel: ImageModel) => void;
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
        width: '380px',
        maxHeight: 'calc(100vh - 120px)',
        overflow: 'auto',
        borderRadius: 2,
        boxShadow: 6,
        margin: 0,
    },
};

const lightInputStyles = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#e0e0e0',               // светлая рамка по умолчанию
        },
        '&:hover fieldset': {
            borderColor: '#bdbdbd',               // чуть темнее при наведении
        },
        '&.Mui-focused fieldset': {
            borderColor: '#90caf9',               // светло‑голубая рамка в фокусе
        },
    },
    '& .MuiInputLabel-root': {
        color: '#9e9e9e',                         // светло‑серый лейбл
        '&.Mui-focused': {
            color: '#90caf9',                     // светло‑голубой лейбл в фокусе
        },
    },
};

const lightCheckboxStyles = {
    color: '#bdbdbd',                             // светло‑серая рамка по умолчанию
    '&.Mui-checked': {
        color: '#ffffff',                         // белая галочка и рамка при активации
    },
};

export const ResizeDialog: React.FC<ResizeDialogProps> = ({ open, imageModel, onResized, onClose }) => {
    const currentWidth = imageModel.metadata.width;
    const currentHeight = imageModel.metadata.height;
    const currentMp = ((currentWidth * currentHeight) / 1_000_000).toFixed(2);

    const [unit, setUnit] = useState<'percent' | 'pixels'>('pixels');
    const [width, setWidth] = useState<number>(currentWidth);
    const [height, setHeight] = useState<number>(currentHeight);
    const [keepProportions, setKeepProportions] = useState(true);
    const [method, setMethod] = useState<InterpolationMethod>('bilinear');

    const [errors, setErrors] = useState<{ width?: string; height?: string }>({});

    const maxDim = 10000;

    const validate = (w: number, h: number) => {
        const err: typeof errors = {};
        if (w < 1 || w > maxDim) err.width = `1–${maxDim}`;
        if (h < 1 || h > maxDim) err.height = `1–${maxDim}`;
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    useEffect(() => {
        if (!open) return;
        setWidth(currentWidth);
        setHeight(currentHeight);
        setUnit('pixels');
        setKeepProportions(true);
        setMethod(useEditorStore.getState().interpolationMethod);
    }, [open, currentWidth, currentHeight]);

    const handleWidthChange = (value: number) => {
        setWidth(value);
        if (keepProportions) {
            const ratio = currentHeight / currentWidth;
            setHeight(Math.round(value * ratio));
        }
        validate(value, height);
    };

    const handleHeightChange = (value: number) => {
        setHeight(value);
        if (keepProportions) {
            const ratio = currentWidth / currentHeight;
            setWidth(Math.round(value * ratio));
        }
        validate(width, value);
    };

    const handleApply = () => {
        const w = unit === 'percent' ? Math.round(currentWidth * width / 100) : width;
        const h = unit === 'percent' ? Math.round(currentHeight * height / 100) : height;
        if (!validate(w, h)) return;

        const newImageData = resample(imageModel.imageData, w, h, method);
        const newModel = new ImageModel(imageModel.metadata, newImageData);
        newModel.metadata.width = w;
        newModel.metadata.height = h;
        onResized(newModel);
        onClose();
    };

    const newMp = (() => {
        const w = unit === 'percent' ? Math.round(currentWidth * width / 100) : width;
        const h = unit === 'percent' ? Math.round(currentHeight * height / 100) : height;
        return ((w * h) / 1_000_000).toFixed(2);
    })();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            hideBackdrop
            disableScrollLock
            disableEnforceFocus
            disableAutoFocus
            disableRestoreFocus
            sx={dialogSx}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, px: 2 }}>
                <Typography variant="subtitle1">Изменить размер</Typography>
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 2, pt: 1, overflow: 'initial' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Typography variant="body2">
                        Текущий размер: {currentWidth} × {currentHeight} ({currentMp} Мп)
                    </Typography>
                    <Typography variant="body2">
                        Новый размер: {unit === 'percent' ? `${width}% × ${height}%` : `${width} × ${height}`} ({newMp} Мп)
                    </Typography>

                    <FormControl size="small" fullWidth sx={lightInputStyles}>
                        <InputLabel id="unit-label">Единицы</InputLabel>
                        <Select
                            labelId="unit-label"
                            value={unit}
                            label="Единицы"
                            onChange={(e) => setUnit(e.target.value as 'percent' | 'pixels')}
                        >
                            <MenuItem value="pixels">Пиксели</MenuItem>
                            <MenuItem value="percent">Проценты</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            label="Ширина"
                            value={width}
                            onChange={(e) => handleWidthChange(Number(e.target.value))}
                            type="number"
                            size="small"
                            error={!!errors.width}
                            helperText={errors.width}
                            sx={lightInputStyles}
                        />
                        <TextField
                            label="Высота"
                            value={height}
                            onChange={(e) => handleHeightChange(Number(e.target.value))}
                            type="number"
                            size="small"
                            error={!!errors.height}
                            helperText={errors.height}
                            sx={lightInputStyles}
                        />
                    </Box>

                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={keepProportions}
                                onChange={(e) => setKeepProportions(e.target.checked)}
                                sx={lightCheckboxStyles}
                            />
                        }
                        label={<Typography variant="caption">Сохранять пропорции</Typography>}
                    />

                    <FormControl size="small" fullWidth sx={lightInputStyles}>
                        <InputLabel id="method-label">Интерполяция</InputLabel>
                        <Select
                            labelId="method-label"
                            value={method}
                            label="Интерполяция"
                            onChange={(e) => setMethod(e.target.value as InterpolationMethod)}
                        >
                            <MenuItem value="nearest">Ближайший сосед</MenuItem>
                            <MenuItem value="bilinear">Билинейная</MenuItem>
                        </Select>
                    </FormControl>

                    <Tooltip
                        title={
                            method === 'nearest'
                                ? 'Быстрый, но пикселизированный.'
                                : 'Гладкая, подходит для фото.'
                        }
                        placement="bottom"
                    >
                        <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                            {method === 'nearest' ? 'Без сглаживания' : 'Сглаженное масштабирование'}
                        </Typography>
                    </Tooltip>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 2, pb: 1.5, justifyContent: 'space-between' }}>
                <Button onClick={onClose} size="small" color="inherit" sx={{ textTransform: 'none' }}>
                    Отмена
                </Button>
                <Button variant="contained" size="small" onClick={handleApply} sx={{ textTransform: 'none' }}>
                    Применить
                </Button>
            </DialogActions>
        </Dialog>
    );
};