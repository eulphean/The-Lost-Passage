
export function isIOSDevice() {
    return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
}

export function isSafari() {
    return window.safari !== undefined;
}