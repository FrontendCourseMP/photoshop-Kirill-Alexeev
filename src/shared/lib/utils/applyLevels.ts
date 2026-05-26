export function applyLevelsToImageData(
    src: ImageData,
    channel: 'master' | string,
    levels: { black: number; white: number; gamma: number },
    maxValue: number
): ImageData {
    const dst = new Uint8ClampedArray(src.data.length);
    dst.set(src.data);
    const data = src.data;

    const { black, white, gamma } = levels;
    const safeBlack = Math.min(black, white - 1);
    const safeWhite = Math.max(white, black + 1);
    const safeGamma = Math.max(0.1, Math.min(9.9, gamma));
    const range = safeWhite - safeBlack;

    const lut = new Uint8Array(maxValue + 1);
    for (let i = 0; i <= maxValue; i++) {
        if (i <= safeBlack) lut[i] = 0;
        else if (i >= safeWhite) lut[i] = maxValue;
        else {
            const normalized = (i - safeBlack) / range;
            const corrected = Math.pow(normalized, safeGamma);
            lut[i] = Math.round(corrected * maxValue);
        }
    }

    const applyToChannel = (channelIdx: number) => {
        for (let i = channelIdx; i < data.length; i += 4) {
            const srcVal = data[i];
            const scaled = Math.round((srcVal / 255) * maxValue);
            const corrected = lut[Math.min(scaled, maxValue)];
            dst[i] = Math.round((corrected / maxValue) * 255);
        }
    };

    if (channel === 'master') {
        applyToChannel(0);
        applyToChannel(1);
        applyToChannel(2);
    } else if (channel === 'R') applyToChannel(0);
    else if (channel === 'G') applyToChannel(1);
    else if (channel === 'B') applyToChannel(2);
    else if (channel === 'A' || channel === 'Alpha') {
        applyToChannel(3);
    } else if (channel === 'Gray') {
        applyToChannel(0);
        applyToChannel(1);
        applyToChannel(2);
    }

    return new ImageData(dst, src.width, src.height);
}