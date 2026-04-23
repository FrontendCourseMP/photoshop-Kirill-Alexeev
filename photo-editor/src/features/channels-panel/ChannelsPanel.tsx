import React, { useMemo } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { useEditorStore } from '@app/store/editorStore';
import { ImageModel } from '@entities/image/model';

interface ChannelsPanelProps {
    imageModel: ImageModel;
}

export const ChannelsPanel: React.FC<ChannelsPanelProps> = ({ imageModel }) => {
    const channelVisibility = useEditorStore((s) => s.channelVisibility);
    const setChannelVisibility = useEditorStore((s) => s.setChannelVisibility);

    const previews = useMemo(() => {
        return imageModel.generateChannelPreviews(64);
    }, [imageModel]);

    const toggleChannel = (channel: string) => {
        setChannelVisibility(channel, !channelVisibility[channel]);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
            <Typography variant="subtitle2">Каналы</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {imageModel.channels.map((channel, idx) => {
                    const visible = channelVisibility[channel] !== false;
                    const preview = previews[idx];
                    if (!preview) return null;

                    const canvas = document.createElement('canvas');
                    canvas.width = preview.width;
                    canvas.height = preview.height;
                    const ctx = canvas.getContext('2d')!;
                    ctx.putImageData(preview, 0, 0);
                    const dataUrl = canvas.toDataURL();

                    return (
                        <Tooltip key={channel} title={`${channel} канал`}>
                            <Box
                                onClick={() => toggleChannel(channel)}
                                sx={{ cursor: 'pointer', opacity: visible ? 1 : 0.3, textAlign: 'center' }}
                            >
                                <Box
                                    component="img"
                                    src={dataUrl}
                                    alt={channel}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        border: '1px solid #999',
                                        filter: visible ? 'none' : 'grayscale(100%)',
                                    }}
                                />
                                <Typography variant="caption">{channel}</Typography>
                            </Box>
                        </Tooltip>
                    );
                })}
            </Box>
        </Box>
    );
};