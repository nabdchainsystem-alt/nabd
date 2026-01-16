import { useState, useLayoutEffect } from 'react';

interface UsePopupPositionProps {
    triggerRect?: DOMRect;
    menuHeight?: number;
    offset?: number;
}

interface PopupPositionStyle {
    position: 'fixed';
    top?: number;
    bottom?: number;
    left?: number;
    maxHeight?: number;
    display?: string;
}

export function usePopupPosition({
    triggerRect,
    menuHeight = 250,
    offset = 4
}: UsePopupPositionProps): PopupPositionStyle {
    const [positionStyle, setPositionStyle] = useState<PopupPositionStyle>(() => {
        if (!triggerRect) return { position: 'fixed', display: 'none' };
        return calculatePosition(triggerRect, menuHeight, offset);
    });

    useLayoutEffect(() => {
        if (triggerRect) {
            setPositionStyle(calculatePosition(triggerRect, menuHeight, offset));
        }
    }, [triggerRect, menuHeight, offset]);

    return positionStyle;
}

function calculatePosition(
    triggerRect: DOMRect,
    menuHeight: number,
    offset: number
): PopupPositionStyle {
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const openUp = spaceBelow < menuHeight && triggerRect.top > menuHeight;

    if (openUp) {
        return {
            position: 'fixed',
            bottom: window.innerHeight - triggerRect.top + offset,
            left: triggerRect.left,
            maxHeight: triggerRect.top - 10
        };
    }

    return {
        position: 'fixed',
        top: triggerRect.bottom + offset,
        left: triggerRect.left,
        maxHeight: window.innerHeight - triggerRect.bottom - 10
    };
}
