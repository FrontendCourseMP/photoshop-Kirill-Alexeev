import { useState, useCallback } from 'react';
import { ImageModel } from '@entities/image/model';
import { useToast } from '@shared/ui/ToastContext';
import { useEditorStore } from '@app/store/editorStore';
import { loadImageFromFile } from '@shared/lib/utils/loader';

export function useImageActions() {
    const [imageModel, setImageModel] = useState<ImageModel | null>(null);
    const { showToast } = useToast();
    const resetChannelVisibility = useEditorStore(s => s.resetChannelVisibility);
    const setEyedropperData = useEditorStore(s => s.setEyedropperData);

    const handleImageLoaded = useCallback((model: ImageModel) => {
        setImageModel(model);
        resetChannelVisibility(model.channels);
        setEyedropperData(null);
        showToast('Изображение успешно загружено', 'success');
    }, [resetChannelVisibility, showToast, setEyedropperData]);

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

    return { imageModel, setImageModel, handleImageLoaded, handleClearImage, handleDropNewImage };
}