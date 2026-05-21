import { useState, useCallback } from 'react';
import { ImageModel } from '@entities/image/model';
import { useToast } from '@shared/ui/ToastContext';
import { useEditorStore } from '@app/store/editorStore';
import { loadImageFromFile } from '@shared/lib/utils/loader';
import {
    APPBAR_HEIGHT,
    STATUSBAR_HEIGHT,
    TOOLS_WIDTH,
    CHANNELS_WIDTH,
} from '@shared/constants/layout';

export function useImageActions() {
    const [imageModel, setImageModel] = useState<ImageModel | null>(null);
    const { showToast } = useToast();
    const resetChannelVisibility = useEditorStore(s => s.resetChannelVisibility);
    const setEyedropperData = useEditorStore(s => s.setEyedropperData);
    const setZoom = useEditorStore(s => s.setZoom);
    const setPan = useEditorStore(s => s.setPan);

    const handleImageLoaded = useCallback((model: ImageModel) => {
        setImageModel(model);
        resetChannelVisibility(model.channels);
        setEyedropperData(null);

        const { width, height } = model.metadata;
        const containerWidth = window.innerWidth - TOOLS_WIDTH - CHANNELS_WIDTH;
        const containerHeight = window.innerHeight - APPBAR_HEIGHT - STATUSBAR_HEIGHT;

        const availableWidth = containerWidth - 100;
        const availableHeight = containerHeight - 100;

        const fitZoom = Math.min(
            (availableWidth / width) * 100,
            (availableHeight / height) * 100,
            300
        );
        const clampedZoom = Math.max(12, Math.min(300, Math.floor(fitZoom)));
        setZoom(clampedZoom);

        const scaledWidth = Math.round(width * clampedZoom / 100);
        const scaledHeight = Math.round(height * clampedZoom / 100);

        const panX = (containerWidth - scaledWidth) / 2;
        const panY = (containerHeight - scaledHeight) / 2;
        setPan({ x: panX, y: panY });

        showToast('Изображение успешно загружено', 'success');
    }, [resetChannelVisibility, showToast, setEyedropperData, setZoom, setPan]);

    const handleClearImage = useCallback(() => {
        setImageModel(null);
        setEyedropperData(null);
        showToast('Холст очищен', 'info');
    }, [showToast, setEyedropperData]);

    const handleDropNewImage = useCallback(async (file: File) => {
        try {
            const model = await loadImageFromFile(file);
            handleImageLoaded(model);
        } catch (err: any) {
            showToast(`Ошибка загрузки: ${err.message || 'Неизвестная ошибка'}`, 'error');
        }
    }, [handleImageLoaded, showToast]);

    return {
        imageModel,
        setImageModel,
        handleImageLoaded,
        handleClearImage,
        handleDropNewImage,
    };
}