import { useState, useLayoutEffect } from 'react';

interface UsePopupPositionProps {
    triggerRect?: DOMRect;
    menuHeight?: number;
    menuWidth?: number;
    offset?: number;
}

interface PopupPositionStyle {
    position: 'fixed';
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    maxHeight?: number;
    display?: string;
}

export function usePopupPosition({
    triggerRect,
    menuHeight = 250,
    menuWidth = 256,
    offset = 4
}: UsePopupPositionProps): PopupPositionStyle {
    const [positionStyle, setPositionStyle] = useState<PopupPositionStyle>(() => {
        if (!triggerRect) return { position: 'fixed', display: 'none' };
        return calculatePosition(triggerRect, menuHeight, menuWidth, offset);
    });

    useLayoutEffect(() => {
        if (triggerRect) {
            setPositionStyle(calculatePosition(triggerRect, menuHeight, menuWidth, offset));
        }
    }, [triggerRect, menuHeight, menuWidth, offset]);

    return positionStyle;
}

function calculatePosition(
    triggerRect: DOMRect,
    menuHeight: number,
    menuWidth: number,
    offset: number
): PopupPositionStyle {
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceRight = window.innerWidth - triggerRect.left;
    const openUp = spaceBelow < menuHeight && triggerRect.top > menuHeight;
    const openLeft = spaceRight < menuWidth + 20;

    // Calculate horizontal position
    let left: number | undefined;
    let right: number | undefined;

    if (openLeft) {
        // Position from the right edge of the trigger, opening leftward
        right = window.innerWidth - triggerRect.right;
    } else {
        left = triggerRect.left;
    }

    if (openUp) {
        return {
            position: 'fixed',
            bottom: window.innerHeight - triggerRect.top + offset,
            left,
            right,
            maxHeight: triggerRect.top - 10
        };
    }

    return {
        position: 'fixed',
        top: triggerRect.bottom + offset,
        left,
        right,
        maxHeight: window.innerHeight - triggerRect.bottom - 10
    };
}
