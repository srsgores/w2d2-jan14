# W2D2

Callbacks, async flow, and multi-threading.

## Why Async?

![Chrome unresponsive](https://miro.medium.com/max/462/0*w2rEwv9mE9xVPhRy.png)

* We don't know how long to wait for something to happen
* Something will take a long time (reading file, complex calcuations)
* The time or order it executes doesn't matter

When we have external resources, particularily on third parties of which we have no control, our app shouldn't break if the data sources do.  Imagine if a webpage started hanging when a request was iniiated to get an airline's logo image.

## `function` Hoisting
Javascript is synchronous (single-threaded); code executes **as it appears**, in the same order __except for functions and variables__, which get *hoisted* to the very top of the file.  Only **one thing** can happen at a time.

```javascript
const airlines = ["Air Canada", "WestJet", "American Airlines"];

const flights = getFlights(airlines);

const getFlights = function(airlines) {
	return airlines.map((airline) => {
		let flightsForAirline = {};
		flightsForAirline[airline] = 4;
	});
}
```

*Even though `getFlights` is defined **after** it gets called, the `function` definition gets **hoisted** as if it had appeared at the very top of the file*.  Note that `function`s **are** variables here.

Think of a boarding gate lineup:

![boarding of a flight](https://raw.githubusercontent.com/tborsa/lectures/master/week2/day2/assets/queue.jpg)

* Customers get processed as they appear, **First-in, first-out** (*FIFO*)
* Customers requiring immediate processing may get **pushed** to the front of the line
* A mediator (clerk/manager) checks for special needs and validates ID before allowing passengers to board


This data structure is known as a **queue**.
 
## Higher-Order Functions

Any `function` which takes a `function` as a parameter or `return`s a `function`.

### Callback Functions

A higher-order `function` which takes a `function` as a paramter, and **calls that function** within itself.

* `Array.map`, `Array.reduce`, `Array.filter`
* `Object.keys`
* `Array.forEach`
* `Array.sort`

Example:

```javascript
const functionThatTakesCallback = function(callback) {
	// do stuff
	return callback(...arguments);
}
```

Remember: **`function`s are first-class citizens in JavaScript**; we can assign references to `function`s and pass them around as variables.

## `setTimeout` vs. `setInterval`

### `setTimeout`

Execute a **callback function** later, after a specified amount of time.

```javascript
setTimeout(function() {console.log("hi")}, 1000); // console.log "hi" after 1 second (1000 milliseconds)
```

`setTimeout` very much acts like `function` hoisting, **except that it executes the function after the file (all synchronous) code has been parsed and executed**.

### `setTimeout` and `setInterval` are unpredictable

Depending on the computer's speed, **if a thread (callback queue) is blocked**, the callback may not execute before or after the specified interval.

`setTimeout` results in the callback getting executed **later***ish* (waiting until all synchronous code has completed, then executing).

### `setInterval`
Run a callback `function` later **and** at specified interval.

```javascript
function pingAirTrafficControl(interval) {
	return setInterval(() => {
		console.log("Paging Magic Airlines");
	}, interval);
}

pingAirTrafficControl(1000);
```

(Causes a `console.log` to execute every second)

## `setTimeout` and Scope

What happens when we attempt to change the scope from within a `setTimeout` or `setInterval`?

```javascript
const higherOrderFunc = function(callback) {
	const data = {initials: "SG" };

	console.log("before timeout call");
	setTimeout(() => {
		data.initials = "SRG";
		callback();
	});
	console.log("after timeout call");  // okay, if not in the setTimeout callback above, as per question 3, what if we return data here? So that result below is set to the data. Like so:
	// return data;
}

console.log("before main call");
const result = higherOrderFunc(() => {
	console.log("inside callback");
});

console.log("after main call");
```

### Understanding the Event Loop

![JavasScript Event Loop](https://miro.medium.com/max/752/1*7GXoHZiIUhlKuKGT22gHmA.png)

1 call stack, 1 queue, and a dispatcher to mediate between the two:

1. Stack
2. Web APIs
2. Event Loop (dispatcher, mediator)
3. Task Queue

__Remember this acronym: **SWET**, like SWAT, but constantly checking for your security__.

#### Pinging

Event loop delegates the execution of `setTimeout`, `setInterval`, and other native web API calls.

Reference the event loop diagram again:

![event loop diagram](https://miro.medium.com/max/792/1*lZ-KXoVNUSOwaq7q8zUBDg.png)

**Asynchronous**:

* `onClick`
* `onChange`
* `onLoad`
* `setTimeout`
* `setInterval`
* `<img>`, `<picture>`, `<link>` (HTTP2 and above only), and `<script>` fetching (HTTP2 or above, or with `async defer`)
* `fetch` and XHR/AJAX requests

Think about how the browser knows to check for events: if this were done synchronously, the browser would lag every few seconds.

![event loop diagram 2](https://johnresig.com/files/Timers.png)

Examples of **synchronous** code:

* `while` loops
* `for` loops
* `Array.map`, `Array.reduce`, `Array.filter`
* `Object.keys`
* `Array.forEach`
* `Array.sort`

## Digging Further

1. *How would we **defer** code execution within a `for` or `while` loop without using `setTimeout`?*
2. *What is the `return` value of `setTimeout`?*
3. *What does `setTimeout(function() {}, 0)` do?*
4. *How do we execute two functions at the same time?*

## Further Reading

1. [Javascript Concurrency Model on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
2. [JSConf: What the Heck Is the Event Loop Anyway?](https://2014.jsconf.eu/speakers/philip-roberts-what-the-heck-is-the-event-loop-anyway.html)
3. [Nima's lecture notes](https://github.com/togmund/async-lecture)
4. [JavaScript Event Loop Explained](https://medium.com/front-end-weekly/javascript-event-loop-explained-4cd26af121d4)
5. [How JavaScript works in Node](https://itnext.io/how-javascript-works-in-browser-and-node-ab7d0d09ac2f)

### "Multi-threaded" Shortcuts

1. [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)-- combining [Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers) with [workbox](https://developers.google.com/web/tools/workbox)
2. `<iframe>`, `<embed>`, via [`<link rel="preload">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content).  `<iframe>`s [load in their own thread in some environments](https://wiki.mozilla.org/Gecko:Overview#Frame_Construction)
3. [`<script async defer>`](https://javascript.info/script-async-defer) to execute only once all scripts have **parsed and executed**