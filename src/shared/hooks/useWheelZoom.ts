import { useEffect, useRef } from 'react';
import { useEditorStore } from '@app/store/editorStore';

export function useWheelZoom(containerRef: React.RefObject<HTMLElement | null>) {
    const zoom = useEditorStore(s => s.zoom);
    const setZoom = useEditorStore(s => s.setZoom);
    const deltaAccum = useRef(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const step = e.deltaY > 0 ? -5 : 5;
            deltaAccum.current += step;

            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                const newZoom = Math.min(300, Math.max(12, zoom + deltaAccum.current));
                setZoom(newZoom);
                deltaAccum.current = 0;
            }, 200);
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', handleWheel);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [containerRef, zoom, setZoom]);
}