/**
 * TOUCH BASICS: LIFECYCLE & COORDINATES
 * 
 * Objectives:
 * 1. Understand touchstart, touchmove, touchend, touchcancel.
 * 2. Track multiple fingers using the 'identifier' property.
 * 3. Map screen coordinates to normalized control values.
 * 4. Implement zero-latency interactions.
 */

const logPanel = document.getElementById('log-panel');
const touchLayer = document.getElementById('touch-layer');
const joystickKnob = document.getElementById('joystick-knob');
const joystickContainer = document.getElementById('joystick-container');
const actionButton = document.getElementById('action-button');

// State management for multi-touch
const activeTouches = new Map();

/**
 * Log touch data to the panel
 */
function log(message) {
    const entry = document.createElement('div');
    entry.textContent = `> ${message}`;
    logPanel.prepend(entry);
    if (logPanel.childNodes.length > 10) {
        logPanel.removeChild(logPanel.lastChild);
    }
}

/**
 * TASK 1: Zero-Latency Button Lab
 * Replace click events with touch events to eliminate 300ms delay.
 */
actionButton.addEventListener('touchstart', (e) => {
    // Prevent default to stop "ghost clicks" and scrolling
    e.preventDefault();
    
    actionButton.classList.add('pressed');
    log('Button: TOUCH START (Instant)');
}, { passive: false });

actionButton.addEventListener('touchend', (e) => {
    actionButton.classList.remove('pressed');
    log('Button: TOUCH END');
});

/**
 * TASK 2: Multi-Touch Tracking & Coordinate Mapping
 * Use 'identifier' to track multiple fingers independently.
 */
document.addEventListener('touchstart', (e) => {
    // changedTouches contains the fingers that JUST started touching
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        
        // TODO: Store touch data in activeTouches Map using touch.identifier as key
        // activeTouches.set(touch.identifier, { ... });
        
        createTouchIndicator(touch);
        log(`New Touch: ID=${touch.identifier} at [${Math.round(touch.clientX)}, ${Math.round(touch.clientY)}]`);
    }
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    // TODO: Loop through changedTouches and update their indicators/logic
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        updateTouchIndicator(touch);
        
        // Handle Joystick Logic if the touch is within the joystick zone
        if (isInside(touch, joystickContainer)) {
            handleJoystick(touch);
        }
    }
}, { passive: false });

document.addEventListener('touchend', (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        removeTouchIndicator(touch.identifier);
        log(`End Touch: ID=${touch.identifier}`);
    }
});

document.addEventListener('touchcancel', (e) => {
    // Handle cases where the system interrupts the touch (e.g., alert popups)
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        removeTouchIndicator(touch.identifier);
        log(`Cancel Touch: ID=${touch.identifier}`);
    }
});

/**
 * COORDINATE MAPPING UTILITIES
 */

function handleJoystick(touch) {
    const rect = joystickContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // TODO: Calculate relative offset from center
    // let dx = touch.clientX - centerX;
    // let dy = touch.clientY - centerY;
    
    // TODO: Normalize coordinates to -1.0 to 1.0 range
    // let normalizedX = dx / (rect.width / 2);
    // let normalizedY = dy / (rect.height / 2);
    
    // Update Knob Position (Visual only for now)
    // joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
    
    log(`Joystick: Mapping X=${touch.clientX.toFixed(0)} Y=${touch.clientY.toFixed(0)}`);
}

function isInside(touch, element) {
    const rect = element.getBoundingClientRect();
    return (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
    );
}

/**
 * VISUAL FEEDBACK: Touch Indicators
 */
function createTouchIndicator(touch) {
    const indicator = document.createElement('div');
    indicator.className = 'touch-indicator';
    indicator.id = `touch-${touch.identifier}`;
    indicator.style.left = `${touch.clientX}px`;
    indicator.style.top = `${touch.clientY}px`;
    touchLayer.appendChild(indicator);
}

function updateTouchIndicator(touch) {
    const indicator = document.getElementById(`touch-${touch.identifier}`);
    if (indicator) {
        indicator.style.left = `${touch.clientX}px`;
        indicator.style.top = `${touch.clientY}px`;
    }
}

function removeTouchIndicator(id) {
    const indicator = document.getElementById(`touch-${id}`);
    if (indicator) {
        indicator.remove();
    }
}

/**
 * TASK 3: UI Safety Lock
 * Prevent pinch-to-zoom and other default gestures.
 */
document.addEventListener('wheel', (e) => {
    if (e.ctrlKey) e.preventDefault(); // Block pinch zoom on trackpad
}, { passive: false });
