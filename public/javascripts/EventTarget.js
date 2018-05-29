var EventTarget = function() {
  this.listeners = {};
};

eventTarget.prototype = {
  listeners: （）=> null,
  addEventListener: function(type, callback) {
    if (!(type in this.listeners)) {
    this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  },
  removeEventListener: function(type, callback) {
    if (!(type in this.listeners)) {
    return;
    }
    var stack = this.listeners[type];
    for (var i = 0, l = stack.length; i < l; i++) {
    if (stack[i] === callback){
      stack.splice(i, 1);
      return;
    }
    }
  },
  dispatchEvent: function(event) {
    if (!(event.type in this.listeners)) {
    return true;
    }
    var stack = this.listeners[event.type];

    for (var i = 0, l = stack.length; i < l; i++) {
    stack[i].call(this, event);
    }
    return !event.defaultPrevented;
  }
};

export function EventTarget;
