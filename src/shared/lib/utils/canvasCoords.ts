export function getCanvasPixelCoords(
    canvas: HTMLCanvasElement,
    clientX: number,
    clientY: number
): { x: number; y: number } | null {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const cssX = clientX - rect.left;
    const cssY = clientY - rect.top;

    const pixelX = Math.floor(cssX * scaleX);
    const pixelY = Math.floor(cssY * scaleY);

    if (pixelX < 0 || pixelX >= canvas.width || pixelY < 0 || pixelY >= canvas.height) {
        return null;
    }
    return { x: pixelX, y: pixelY };
}