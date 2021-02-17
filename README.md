# User-agent Idle state callback  
This library/npm helper to add users idle state Listener on browser

## Setup

Install ` idle-state-listener `:

```
npm install idle-state-listener --save-dev
```

## Demo
URL: http://rmanivannan.github.io/demos/idel-state-manager/index.htm

## Example

``` javascript

var stateManager = require('idle-state-listener').GetState();

// UI active state indication 
UI.setAttribute("class", "active");

// add listener for idle state, after 5s(5000ms) of users idle state callback function get invoked
var state5sec = stateManager.addListener(5000, function() {
  UI.removeAttribute("class"); // 
}); 

stateManager.removeListener(5000); // removed the attached listened by argument value / time delay in ms
//state5sec.removeListener(); // same as above 

state5sec.reInitiate() // re-initiates 5sec state

```
