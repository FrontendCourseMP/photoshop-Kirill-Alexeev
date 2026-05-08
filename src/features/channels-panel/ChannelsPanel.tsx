import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
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
        <Box sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Каналы
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'start' }}>
                {imageModel.channels.map((channel, idx) => {
                    const visible = channelVisibility[channel] !== false;
                    const preview = previews[idx];
                    if (!preview) return null;

                    const isAlpha = channel === 'A' || channel === 'Alpha';

                    const canvas = document.createElement('canvas');
                    canvas.width = preview.width;
                    canvas.height = preview.height;
                    const ctx = canvas.getContext('2d')!;

                    if (isAlpha) {
                        const patternCanvas = document.createElement('canvas');
                        patternCanvas.width = 8;
                        patternCanvas.height = 8;
                        const pctx = patternCanvas.getContext('2d')!;
                        pctx.fillStyle = '#ffffff';
                        pctx.fillRect(0, 0, 8, 8);
                        pctx.fillStyle = '#cccccc';
                        pctx.fillRect(0, 0, 4, 4);
                        pctx.fillRect(4, 4, 4, 4);
                        const pattern = ctx.createPattern(patternCanvas, 'repeat');
                        if (pattern) {
                            ctx.fillStyle = pattern;
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                        }
                    }

                    ctx.putImageData(preview, 0, 0);
                    const dataUrl = canvas.toDataURL();

                    return (
                        <Box
                            key={channel}
                            onClick={() => toggleChannel(channel)}
                            sx={{
                                cursor: 'pointer',
                                opacity: visible ? 1 : 0.3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Box
                                component="img"
                                src={dataUrl}
                                alt={channel}
                                sx={{
                                    width: '100%',
                                    objectFit: 'contain',
                                    filter: visible ? 'none' : 'grayscale(100%)',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            />
                            <Typography
                                variant="caption"
                                sx={{
                                    mt: 0.5,
                                    textAlign: 'center',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {channel}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};