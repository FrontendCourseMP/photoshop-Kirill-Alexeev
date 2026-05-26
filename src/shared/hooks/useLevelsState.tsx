import { useState, useEffect, useCallback, useMemo } from 'react';
import { useEditorStore } from '@app/store/editorStore';
import { applyLevelsToImageData } from '@shared/lib/utils/applyLevels';
import { ImageModel } from '@entities/image/model';

const defaultLevels = (max: number) => ({ black: 0, white: max, gamma: 1.0 });

export function useLevelsState(
    open: boolean,
    imageModel: ImageModel,
    availableChannels: string[],
    onApplyFinal: (newData: ImageData) => void
) {
    const maxValue = imageModel.metadata.colorDepth === 7 ? 127 : 255;
    const { setMasterPreviewImageData, clearMasterPreview } = useEditorStore();

    const [activeChannel, setActiveChannel] = useState('master');
    const [levels, setLevels] = useState<Record<string, { black: number; white: number; gamma: number }>>({});
    const [previewEnabled, setPreviewEnabled] = useState(true);

    useEffect(() => {
        if (!open) return;
        const init: Record<string, any> = {};
        availableChannels.forEach(ch => {
            init[ch] = defaultLevels(maxValue);
        });
        setLevels(init);
        setActiveChannel('master');
        setPreviewEnabled(true);
    }, [open, maxValue, availableChannels]);

    const computeMasterPreview = useCallback((): ImageData | undefined => {
        if (!imageModel) return;
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
        return result;
    }, [imageModel, availableChannels, levels, maxValue]);

    useEffect(() => {
        if (!open) return;
        if (previewEnabled) {
            const preview = computeMasterPreview();
            if (preview) setMasterPreviewImageData(preview);
        } else {
            clearMasterPreview();
        }
    }, [previewEnabled, computeMasterPreview, open, setMasterPreviewImageData, clearMasterPreview]);

    const current = levels[activeChannel] ?? defaultLevels(maxValue);

    const handleChangeCommitted = (black: number, white: number, gamma: number) => {
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
        const result = computeMasterPreview();
        if (result) {
            clearMasterPreview();
            onApplyFinal(result);
        }
    };

    const handleCancel = () => {
        clearMasterPreview();
    };

    const previewImageData = useMemo(() => {
        return computeMasterPreview() ?? imageModel.imageData;
    }, [computeMasterPreview, imageModel.imageData, levels, previewEnabled]);

    return {
        activeChannel,
        setActiveChannel,
        current,
        previewEnabled,
        setPreviewEnabled,
        handleChangeCommitted,
        handleReset,
        handleApply,
        handleCancel,
        maxValue,
        previewImageData,
    };
}