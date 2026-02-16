export type Disposable = {
	[Symbol.dispose](): void;
};

/**
Create a disposable setTimeout wrapper.

@param callback - The function to call after the delay.
@param milliseconds - The delay in milliseconds.
@returns A disposable that clears the timeout on dispose.

@example
```
import {disposableTimer} from 'disposable-from';

const timer = disposableTimer(() => console.log('fired'), 1000);
timer[Symbol.dispose](); // Clears the timeout
```
*/
export function disposableTimer(callback: () => void, milliseconds: number): Disposable;

/**
Create a disposable setInterval wrapper.

@param callback - The function to call on each interval.
@param milliseconds - The interval in milliseconds.
@returns A disposable that clears the interval on dispose.

@example
```
import {disposableInterval} from 'disposable-from';

const interval = disposableInterval(() => console.log('tick'), 500);
interval[Symbol.dispose](); // Clears the interval
```
*/
export function disposableInterval(callback: () => void, milliseconds: number): Disposable;

/**
Create a disposable event listener wrapper.

@param target - The event target.
@param event - The event name.
@param listener - The event listener.
@param options - The addEventListener options.
@returns A disposable that removes the listener on dispose.

@example
```
import {disposableListener} from 'disposable-from';

const listener = disposableListener(eventTarget, 'click', () => console.log('clicked'));
listener[Symbol.dispose](); // Removes the event listener
```
*/
export function disposableListener(
	target: EventTarget,
	event: string,
	listener: EventListenerOrEventListenerObject,
	options?: AddEventListenerOptions | boolean,
): Disposable;

/**
Create a disposable from a setup function that returns a teardown function.

@param setup - A function that performs setup and returns a teardown function.
@returns A disposable that runs the teardown on dispose.

@example
```
import {disposableCallback} from 'disposable-from';

const resource = disposableCallback(() => {
	const connection = createConnection();
	return () => connection.close();
});
resource[Symbol.dispose](); // Runs the teardown
```
*/
export function disposableCallback(setup: () => () => void): Disposable;
