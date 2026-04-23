import { create } from 'zustand';

export type ToolType = 'select' | 'eyedropper' | 'pencil' | 'eraser' | null;

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

interface EditorState {
    currentTool: ToolType;
    channelVisibility: ChannelVisibility;
    eyedropperData: EyedropperData | null;

    setCurrentTool: (tool: ToolType) => void;
    setChannelVisibility: (channel: string, visible: boolean) => void;
    resetChannelVisibility: (channels: string[]) => void;
    setEyedropperData: (data: EyedropperData | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    currentTool: null,
    channelVisibility: {},
    eyedropperData: null,

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
}));