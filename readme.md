<div align="center">
  <img src="docs/assets/logo.svg" alt="disposable-from — Create Disposable wrappers for timers, event listeners, intervals, and custom cleanup" width="720">
</div>

<p align="center"><strong>Create Disposable wrappers for timers, event listeners, intervals, and custom cleanup</strong></p>

<p align="center">
  <a href="https://github.com/mstuart/disposable-from/actions/workflows/main.yml"><img src="https://github.com/mstuart/disposable-from/actions/workflows/main.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://www.npmjs.com/package/disposable-from"><img src="https://img.shields.io/npm/v/disposable-from?label=npm" alt="npm"></a>
  <img src="https://img.shields.io/badge/node-%E2%89%A520-339933.svg" alt="Node 20+">
  <a href="https://deepwiki.com/mstuart/disposable-from"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
  <a href="https://socket.dev/npm/package/disposable-from"><img src="https://socket.dev/api/badge/npm/package/disposable-from" alt="Socket"></a>
</p>

---
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
