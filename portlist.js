// Serial Port
const { SerialPort } = require('serialport')
const { autoDetect } = require('@serialport/bindings-cpp')
const { ReadlineParser } = require('@serialport/parser-readline')
const BaudRate = 9600

const Binding = autoDetect()
// const PortList = await Binding.list()
SerialPort.list().then(function(ports){
ports.forEach(function(port){
    console.log("Port: ", port);
})
});
console.log(Binding.list)