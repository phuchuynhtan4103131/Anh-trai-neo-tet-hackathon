function setupViewportGuards() {
    const zoomKeyCodes = new Set(['Equal', 'Minus', 'Digit0', 'NumpadAdd', 'NumpadSubtract', 'Numpad0']);

    window.addEventListener('wheel', (event) => {
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
        }
    }, { passive: false });

    window.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && (zoomKeyCodes.has(event.code) || event.key === '+' || event.key === '-' || event.key === '0')) {
            event.preventDefault();
        }
    }, { passive: false });

    window.addEventListener('gesturestart', (event) => {
        event.preventDefault();
    }, { passive: false });

    const blockMultiTouch = (event) => {
        if (event.touches && event.touches.length > 1) {
            event.preventDefault();
        }
    };

    window.addEventListener('touchstart', blockMultiTouch, { passive: false });
    window.addEventListener('touchmove', blockMultiTouch, { passive: false });
}

// Initialize game when window loads
window.addEventListener('load', () => {
    setupViewportGuards();
    // Create and store game engine instance globally
    window.gameEngine = new GameEngine();
});