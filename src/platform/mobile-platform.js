// Set only by the Android-specific HTML entry, never by the ordinary website.
export const isAndroidApp=globalThis.__WEROAM_ANDROID__===true;
// Screen width alone also matches desktop windows. Detect actual mobile OSs;
// native desktop IPC always takes precedence, including touch-screen Windows.
export const supportsDesktopPet=!isAndroidApp&&(!!globalThis.desktopMain||!(/Android|iPhone|iPad|iPod/i.test(globalThis.navigator?.userAgent||'')||(globalThis.navigator?.platform==='MacIntel'&&globalThis.navigator?.maxTouchPoints>1)));
