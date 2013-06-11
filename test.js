var EventEmitter = require('events').EventEmitter,
    fs = require('fs');

/*
 * Test EventEmitter
 */
var emitter = new EventEmitter();
emitter.on('data', function (data) {
    console.log(data);
});
emitter.emit('data', 'Hello, Events!');
emitter.emit('data', 'Hello, Events2!');

fs.writeFile('/hello.txt', 'Hello, File System!', function (err) {
    if (err) console.log(err.message);
    else console.log('Write successful for /hello.txt');
});

/*
 * Test File Read
 */
fs.readFile('/hello.txt', function (err, data) {
    if (err) {
        console.log(err.message);
    } else {
        console.log(data);
    }
});

fs.writeFile('/usr/bin/hello.txt', 'Hello, BIN!', function (err) {
    if (err) console.log(err.message);
    else console.log('Write successful for /usr/bin/hello.txt');
});

/*
 * Test File Read
 */
fs.readFile('/usr/bin/hello.txt', function (err, data) {
    if (err) {
        console.log(err.message);
    } else {
        console.log(data);
    }
});
    
var fws = fs.createWriteStream('/hi.txt');
fws.write('Cool WriteStream Yea!');
fws.on('finish', function () {
    console.log('Writing to WriteStream successful!');
});
fws.on('error', function (err) {
    console.log(err.message);
});

var frs = fs.createReadStream('/hi.txt');
frs.on('readable', function () {
    var content = frs.read();
    console.log('File ReadStream: ' + content);
});
frs.on('error', function (err) {
    console.log(err.message);
});
