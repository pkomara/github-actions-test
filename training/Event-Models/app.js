const event = require('events');

const eventEmmiter = new event.EventEmitter();

const listenerOne = () =>{
    console.log('listener one executed');
};

const listenerTwo = () =>{
    console.log('listener two executed');
};

eventEmmiter.addListener('connection',listenerOne);

eventEmmiter.on('connection',listenerTwo);

eventEmmiter.emit('connection')