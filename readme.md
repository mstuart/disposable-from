# disposable-from

> Create Disposable wrappers for timers, event listeners, intervals, and custom cleanup

## Install

```sh
npm install disposable-from
```

## Usage

```js
import {disposableTimer, disposableInterval, disposableListener, disposableCallback} from 'disposable-from';

// Timer
const timer = disposableTimer(() => console.log('fired'), 1000);
timer[Symbol.dispose](); // Clears the timeout

// Interval
const interval = disposableInterval(() => console.log('tick'), 500);
interval[Symbol.dispose](); // Clears the interval

// Event listener
const listener = disposableListener(target, 'click', () => console.log('clicked'));
listener[Symbol.dispose](); // Removes the listener

// Custom cleanup
const resource = disposableCallback(() => {
	const connection = openConnection();
	return () => connection.close();
});
resource[Symbol.dispose](); // Runs the teardown
```

## API

### disposableTimer(callback, milliseconds)

Creates a `setTimeout` and returns a disposable that clears it.

### disposableInterval(callback, milliseconds)

Creates a `setInterval` and returns a disposable that clears it.

### disposableListener(target, event, listener, options?)

Adds an event listener and returns a disposable that removes it.

### disposableCallback(setup)

Calls `setup()` which should return a teardown function. Returns a disposable that runs the teardown.

## Related

- [using-safe](https://github.com/mstuart/using-safe) - Safely use and dispose resources

## License

MIT
