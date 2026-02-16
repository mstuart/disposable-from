/**
Create a disposable setTimeout wrapper.

@param {Function} callback - The function to call after the delay.
@param {number} milliseconds - The delay in milliseconds.
@returns {{[Symbol.dispose]: () => void}} A disposable that clears the timeout.
*/
export function disposableTimer(callback, milliseconds) {
	let id = setTimeout(callback, milliseconds);
	return {
		[Symbol.dispose]() {
			clearTimeout(id);
			id = undefined;
		},
	};
}

/**
Create a disposable setInterval wrapper.

@param {Function} callback - The function to call on each interval.
@param {number} milliseconds - The interval in milliseconds.
@returns {{[Symbol.dispose]: () => void}} A disposable that clears the interval.
*/
export function disposableInterval(callback, milliseconds) {
	let id = setInterval(callback, milliseconds);
	return {
		[Symbol.dispose]() {
			clearInterval(id);
			id = undefined;
		},
	};
}

/**
Create a disposable event listener wrapper.

@param {EventTarget} target - The event target.
@param {string} event - The event name.
@param {Function} listener - The event listener.
@param {object} [options] - The addEventListener options.
@returns {{[Symbol.dispose]: () => void}} A disposable that removes the listener.
*/
export function disposableListener(target, event, listener, options) {
	target.addEventListener(event, listener, options);
	let disposed = false;
	return {
		[Symbol.dispose]() {
			if (!disposed) {
				disposed = true;
				target.removeEventListener(event, listener, options);
			}
		},
	};
}

/**
Create a disposable from a setup function that returns a teardown function.

@param {Function} setup - A function that performs setup and returns a teardown function.
@returns {{[Symbol.dispose]: () => void}} A disposable that runs the teardown.
*/
export function disposableCallback(setup) {
	const teardown = setup();
	let disposed = false;
	return {
		[Symbol.dispose]() {
			if (!disposed) {
				disposed = true;
				teardown();
			}
		},
	};
}
