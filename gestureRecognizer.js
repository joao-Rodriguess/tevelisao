class GestureRecognizer {
    constructor(options = {}) {
        this.options = {
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
            gestureCooldown: 3500,
            ...options,
        };
        this.lastGestureTime = 0;
    }

    /** Detects a gesture and returns an identifier string or null */
    detect(landmarks) {
        const now = Date.now();
        if (now - this.lastGestureTime < this.options.gestureCooldown) return null;

        const gesture = this.identifyGesture(landmarks);
        if (gesture) {
            this.lastGestureTime = now;
        }
        return gesture;
    }

    /** Pure gesture identification without side effects (cooldowns) */
    identifyGesture(landmarks) {
        // Existing gestures
        if (this.isThumbsUp(landmarks)) return 'THUMBS_UP';
        if (this.isThumbsDown(landmarks)) return 'THUMBS_DOWN';
        if (this.isPeaceSign(landmarks)) return 'PEACE_SIGN';
        // New gestures
        if (this.isOpenHand(landmarks)) return 'OPEN_HAND';
        if (this.isFist(landmarks)) return 'FIST';
        if (this.isVSignWithThumb(landmarks)) return 'V_THUMB';
        return null;
    }

    // Helper gesture checks
    isThumbsUp(l) {
        // Thumb extended UP (tip above IP AND above Index PIP) + Fingers Curled
        // L6 is Index PIP (knuckle mid-finger). L4 must be significantly higher.
        return l[4].y < l[3].y && l[4].y < l[6].y && l[8].y > l[6].y && l[12].y > l[10].y && l[16].y > l[14].y && l[20].y > l[18].y;
    }
    isThumbsDown(l) {
        // Thumb extended DOWN (tip below IP AND below Index PIP) + Fingers Curled
        // L4 is thumb tip, L3 is IP. L4.y > L3.y means tip is below IP.
        return l[4].y > l[3].y && l[4].y > l[6].y && l[8].y > l[6].y && l[12].y > l[10].y && l[16].y > l[14].y && l[20].y > l[18].y;
    }
    isPeaceSign(l) {
        return l[8].y < l[6].y && l[12].y < l[10].y && l[16].y > l[14].y && l[20].y > l[18].y;
    }
    isOpenHand(l) {
        // All fingers extended
        return [8, 12, 16, 20].every(i => l[i].y < l[i - 2].y);
    }
    isFist(l) {
        // All fingers curled
        // Thumb Tip (4) should NOT be above Index PIP (6). 
        // This allows thumb to rest ON the fingers but rejects "pointing up".
        return [8, 12, 16, 20].every(i => l[i].y > l[i - 2].y) && l[4].y > l[6].y;
    }
    isVSignWithThumb(l) {
        // V sign (index & middle extended) + thumb extended
        return this.isPeaceSign(l) && l[4].y < l[3].y;
    }
}

// Expose globally for script.js
window.GestureRecognizer = GestureRecognizer;
