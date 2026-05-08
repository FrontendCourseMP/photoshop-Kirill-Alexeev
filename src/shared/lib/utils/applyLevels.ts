// src/shared/lib/levels/applyLevels.ts
export function applyLevelsToImageData(
    src: ImageData,
    channel: 'master' | string,
    levels: { black: number; white: number; gamma: number },
    maxValue: number
): ImageData {
    const dst = new Uint8ClampedArray(src.data.length);
    dst.set(src.data);

    const { black, white, gamma } = levels;
    const safeBlack = Math.min(black, white - 1);
    const safeWhite = Math.max(white, black + 1);
    const safeGamma = Math.max(0.1, Math.min(9.9, gamma));
    const range = safeWhite - safeBlack;

    // Построим LUT для одного канала (0..maxValue)
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

    // Применяем к нужным индексам
    const applyToIndex = (idx: number) => {
        for (let i = idx; i < src.data.length; i += 4) {
            dst[i] = lut[src.data[i]];
        }
    };

    if (channel === 'master') {
        applyToIndex(0); // R
        applyToIndex(1); // G
        applyToIndex(2); // B
        // Альфу не трогаем
    } else if (channel === 'R') applyToIndex(0);
    else if (channel === 'G') applyToIndex(1);
    else if (channel === 'B') applyToIndex(2);
    else if (channel === 'A' || channel === 'Alpha') applyToIndex(3);
    else if (channel === 'Gray') {
        applyToIndex(0);
        applyToIndex(1);
        applyToIndex(2);
    }

    return new ImageData(dst, src.width, src.height);
}