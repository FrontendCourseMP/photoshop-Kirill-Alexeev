import { create } from 'zustand';
import { InterpolationMethod } from '@shared/lib/utils/interpolation';

export type ToolType = 'select' | 'eyedropper' | 'pencil' | 'eraser' | 'hand' | null;

interface ChannelVisibility {
    [channelName: string]: boolean;
}

interface EyedropperData {
    x: number;
    y: number;
    r: number;
    g: number;
    b: number;
    L: number;
    aStar: number;
    bStar: number;
}

interface LevelsPreview {
    channel: string;
    levels: { black: number; white: number; gamma: number };
    maxValue: number;
}

interface EditorState {
    currentTool: ToolType;
    channelVisibility: ChannelVisibility;
    eyedropperData: EyedropperData | null;
    levelsPreview: LevelsPreview | null;
    masterPreviewImageData: ImageData | null;
    zoom: number;
    interpolationMethod: InterpolationMethod;
    pan: { x: number; y: number };

    setCurrentTool: (tool: ToolType) => void;
    setChannelVisibility: (channel: string, visible: boolean) => void;
    resetChannelVisibility: (channels: string[]) => void;
    setEyedropperData: (data: EyedropperData | null) => void;
    setLevelsPreview: (preview: LevelsPreview | null) => void;
    clearLevelsPreview: () => void;
    setMasterPreviewImageData: (data: ImageData | null) => void;
    clearMasterPreview: () => void;
    setZoom: (zoom: number) => void;
    setInterpolationMethod: (method: InterpolationMethod) => void;
    setPan: (pan: { x: number; y: number }) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    currentTool: null,
    channelVisibility: {},
    eyedropperData: null,
    levelsPreview: null,
    masterPreviewImageData: null,
    zoom: 100,
    interpolationMethod: 'bilinear',
    pan: { x: 0, y: 0 },

    setCurrentTool: (tool) => set({ currentTool: tool }),
    setChannelVisibility: (channel, visible) =>
        set((state) => ({
            channelVisibility: {
                ...state.channelVisibility,
                [channel]: visible,
            },
        })),
    resetChannelVisibility: (channels) => {
        const vis: ChannelVisibility = {};
        channels.forEach((ch) => (vis[ch] = true));
        set({ channelVisibility: vis });
    },
    setEyedropperData: (data) => set({ eyedropperData: data }),
    setLevelsPreview: (preview) => set({ levelsPreview: preview }),
    clearLevelsPreview: () => set({ levelsPreview: null }),
    setMasterPreviewImageData: (data) => set({ masterPreviewImageData: data }),
    clearMasterPreview: () => set({ masterPreviewImageData: null }),
    setZoom: (zoom) => set({ zoom }),
    setInterpolationMethod: (method) => set({ interpolationMethod: method }),
    setPan: (pan) => set({ pan }),
}));