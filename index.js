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
var Readable = function () {
    EventEmitter.call(this);
};

Readable.prototype.__proto__ = events.EventEmitter.prototype;

Readable.prototype.data = undefined;

Readable.prototype.read = function () {
    return this.data;
};

Readable.prototype._read = function (size) {
    throw new Error('Function is not overriden!');
};

Readable.prototype.on = function (event, listener) {
    EventEmitter.prototype.on.call(this, event, listener);

    if (event === 'readable') {
        // Always zero for now. But implementors should read data.
        this._read(0);
    }
};

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

        cb(null);
    });
};

FileSystem.ReadStream = function () {
    Readable.call(this);
};

FileSystem.ReadStream.prototype.__proto__ = Readable.prototype;

FileSystem.ReadStream.prototype.path = undefined;

FileSystem.ReadStream.prototype._read = function (size) {
    var _this = this;
    fs.readFile(this.path, function (err, data) {
        _this.data = data;
        _this.emit('readable');
    });
};

FileSystem.prototype.createReadStream = function (path) {
    var frs = new FileSystem.ReadStream();
    frs.path = path;
    return frs;
};

var fs = new FileSystem();

function require(modName) {
    if (modName === 'events') {
        return events;
    } else if (modName === 'fs') {
        return fs;
    }
}
