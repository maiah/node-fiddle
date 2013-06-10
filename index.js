function async(fn) {
    setTimeout(fn, 0);
}

/*
 * EventEmitter prototype
 */
var EventEmitter = function () {
    this.events = {};
    this.onceEvents = {};
};

function addListener(event, listener) {
    if (this.events[event] === undefined) {
        this.events[event] = new Array();
    }
    this.events[event].push(listener);
};

function once(event, listener) {
    if (this.onceEvents[event] === undefined) {
        this.onceEvents[event] = new Array();
    }
    this.onceEvents[event].push(listener);
}

function removeListener(event, listener) {
    removeFromArray(this.events[event], listener);
    removeFromArray(this.onceEvents[event], listener);
}

function removeFromArray(array, listener) {
    if (array !== undefined) {
        var removeIdx = array.indexOf(listener);
        if (removeIdx !== -1) {
            array.splice(removeIdx, 1);
        }
    }
}

function emit() {
    var event = arguments[0];
    var args = new Array();
    
    var marker = 0;
    for (var key in arguments) {
        if (marker !== 0) {
            args.push(arguments[key]);
        }
        marker++;
    }

    var listeners = this.events[event];
    if (listeners !== undefined) {
        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];
            listener.apply(undefined, args);
        }
    }

    var onceListeners = this.onceEvents[event];
    if (onceListeners !== undefined) {
        for (var i = 0; i < onceListeners.length; i++) {
            var onceListener = onceListeners[i];
            onceListener.apply(undefined, args);
            this.removeListener(event, onceListener);
        }
    }
}

EventEmitter.prototype.addListener = addListener;
EventEmitter.prototype.on = addListener;
EventEmitter.prototype.once = once;
EventEmitter.prototype.removeListener = removeListener;
EventEmitter.prototype.emit = emit;

var events = {};
events.EventEmitter = EventEmitter;

/*
 * Streams
 */
var Readable = function () {};

Readable.prototype._read = undefined;
Readable.prototype.push = undefined;
Readable.prototype.unshift = undefined;
Readable.prototype.wrap = undefined;
Readable.prototype.setEncoding = undefined;
Readable.prototype.read = undefined;
Readable.prototype.pipe = undefined;
Readable.prototype.unpipe = undefined;
Readable.prototype.pause = undefined;
Readable.prototype.pipe = undefined;
Readable.prototype.resume = undefined;

/*
 * I/O File System
 */
var File = function (location, name, content) {
    this.location = location;
    this.name = name;
    this.content = content;
};

var FileSystem = function () {
    this.files = {};
};

FileSystem.prototype.readFile = function (filename, cb) {
    var _this = this;
    async(function () {
        var file = _this.files[filename];
        if (file !== undefined) {
            cb(null, file.content);
        } else {
            cb(new Error('File Not Found Error'), null);
        }
    });
};

FileSystem.prototype.writeFile = function (filename, data, cb) {
    var _this = this;
    async(function () {
        var path = filename.split('/');
        var nameIndex = path.length - 1;

        var location = '';
        if (path.length > 2) {
            for (var i = 0; i < path.length - 1; i++) {
                location += '/' + path[i];
            }

        } else {
            location = '/';
        }

        var name = path[nameIndex];

        file = new File(location, name, data);
        _this.files[filename] = file;
    });
};

var fs = new FileSystem();

function require(modName) {
    if (modName === 'events') {
        return events;
    } else if (modName === 'fs') {
        return fs;
    }
}
