var visibleChangeListener = (function(){
    var stateKey, 
        eventKey,
        callback, 
        keys = {
                hidden       : "visibilitychange",
                webkitHidden : "webkitvisibilitychange",
                mozHidden    : "mozvisibilitychange",
                msHidden     : "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }

    var addVisibleChangeListener = function(callback) {
        if (callback) 
            document.addEventListener(eventKey, callback);
        return !document[eventKey];
    };
    var removeVisibleChangeListener = function() {
        if (callback) 
            document.removeEventListener(eventKey, callback);
    };
    return {
        addVisibleChangeListener: addVisibleChangeListener,
        removeVisibleChangeListener: removeVisibleChangeListener
    };
})();


function UserStateManager () {
  var localOb = null;
  this.addListener = function (ts,cb) {
    var stateName = 'state_ts_'+ts;
    if(!localOb){
      this.eventManager();
      localOb = [];
    }
    if (!localOb[stateName] && !isNaN(ts)){
      localOb[stateName] = {};
      localOb[stateName]['duration'] = ts;
      this.setTimers(ts,cb);
    }else{
      console.warn('Can\'t add ' + stateName + ' as it is already exist (or) invalid input.');
      return false;
    }
  }
  this.setTimers = function (ts,cb) {
    var stateName = 'state_ts_'+ts;
    var self = this;
    localOb[stateName]['timer'] = setTimeout(function () {
      cb();
      self.removeListener(localOb[stateName]['duration']);
    },ts);
    localOb[stateName]['endTs'] = ts + (new Date()).getTime();
    localOb[stateName]['cb'] = cb;
  }
  this.removeListener = function (ts) {
    var stateName = 'state_ts_'+ts;
    if(localOb[stateName]){
      clearTimeout(localOb[stateName]['timer']);
      delete localOb[stateName];
    }else{
      console.warn('state for duration - ' + ts + ' is not avialble to remove');
    }
  }
  this.removeAllListeners = function () {
    for(var i in localOb){
      clearTimeout(localOb[i]['timer']);
    }
    localOb = null;
  }
  this.eventManager = function () {
    var self = this;
    window.onmousemove =(function (e) {
                            // to avoid invalid mouse event in chrome
                            if(self.xy == (e.clientX  + 'x' + e.clientY)) return true;
                            self.xy = e.clientX + 'x' + e.clientY;
                            self.resetTimerForActiveUser.call(self);
                        });
    window.onmousedown = this.resetTimerForActiveUser(this); 
    window.onclick     = this.resetTimerForActiveUser.bind(this);
    window.onscroll    = this.resetTimerForActiveUser.bind(this);
    window.onkeypress  = this.resetTimerForActiveUser.bind(this);
    window.onfocus     = this.resetTimeoutONFocus.bind(this);
    window.onpageshow  = this.resetTimeoutONFocus.bind(this);
    visibleChangeListener.addVisibleChangeListener(function(){
      self.resetTimeoutONFocus();
    });
  }
  this.resetTimeoutONFocus = function () {
    for(var i in localOb){
      if(localOb[i])
      if(localOb[i]['endTs'] >= (new Date()).getTime()){
          clearTimeout(localOb[i]['timer']);
          this.setTimers(localOb[i]['duration'],localOb[i]['cb']);
        }else{
          self.removeListener(localOb[i]['duration']);
          localOb[i]['cb']();
        }
    }
  }
  this.resetTimerForActiveUser = function (e) {
    for(var i in localOb){
      if(localOb[i]){
        var ts = localOb[i]['duration'];
        var cb = localOb[i]['cb'];
        if(localOb[i]['endTs'] >= (new Date()).getTime()){
          clearTimeout(localOb[i]['timer']);
          this.setTimers(ts,cb);
        }else{
          self.removeListener(ts);
          cb();
        }
      }
    }
  }
}
var stateManager;
var GetState = function () {
  if(!stateManager){
    stateManager = new UserStateManager();
  }
  return stateManager;
}
if(module) 
  module.exports = {"GetState": GetState}
