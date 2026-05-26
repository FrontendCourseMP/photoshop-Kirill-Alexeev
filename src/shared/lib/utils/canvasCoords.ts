export function getCanvasPixelCoords(
    canvas: HTMLCanvasElement,
    clientX: number,
    clientY: number,
    zoom: number = 100
): { x: number; y: number } | null {
    const rect = canvas.getBoundingClientRect();
    const cssWidth = rect.width;
    const cssHeight = rect.height;
    const physicalWidth = canvas.width;
    const physicalHeight = canvas.height;
    const scaleX = physicalWidth / cssWidth;
    const scaleY = physicalHeight / cssHeight;

    const mouseCanvasX = clientX - rect.left;
    const mouseCanvasY = clientY - rect.top;

    const pixelX = Math.floor(mouseCanvasX * scaleX);
    const pixelY = Math.floor(mouseCanvasY * scaleY);

    if (pixelX < 0 || pixelX >= physicalWidth || pixelY < 0 || pixelY >= physicalHeight) {
        return null;
    }

    const originalX = Math.floor(pixelX * 100 / zoom);
    const originalY = Math.floor(pixelY * 100 / zoom);

    const originalWidth = Math.round(physicalWidth * 100 / zoom);
    const originalHeight = Math.round(physicalHeight * 100 / zoom);

    if (originalX < 0 || originalX >= originalWidth || originalY < 0 || originalY >= originalHeight) {
        return null;
    }

    return { x: originalX, y: originalY };
}