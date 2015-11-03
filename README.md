# User-agent Idle state callback  
JavaScript helper to add users idle state Listener on browser

## Setup

Install ` idle-state-listener `:

```
npm install idle-state-listener --save-dev
```

## Example

``` javascript

var stateManager = require('idle-state-listener').GetState();

// UI active state indication 
UI.setAttribute("class", "active");

// add listener for idle state, after 5s(5000ms) of users idle state callback function get invoked
stateManager.addListener(5000, function() {
  UI.removeAttribute("class"); // 
}); 

state.removeListener(5000); // removed the attached listened by argument value / time delay in ms

```
