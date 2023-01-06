const express = require('express')
const bodyParser = require('body-parser')
const { createServer } = require("http")
const jayson = require('jayson')
const cors = require("cors")
const app = express()
const httpServer = createServer(app)
const ServerPort = 8080
const logsRouter = require('./routes/logs');
const apiRouter = require('./routes/api');
const devicesRouter = require('./routes/devices');
const logs = require('./services/logs');
const device = require("./services/devices")

// Serial Port
const { SerialPort } = require('serialport')
const { autoDetect } = require('@serialport/bindings-cpp')
const { ReadlineParser } = require('@serialport/parser-readline')
const BaudRate = 9600

// Websocket
const wsPort = 6001
const { Server } = require("socket.io")

const topic = "server-topic"
let data = []

app.use(cors()) 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/logs', logsRouter)
app.use('/api', apiRouter)
app.use('/devices', devicesRouter)

const nodeData = {
    says: function(args, callback) {
        storeData(args)
        
        // io.emit(topic, data)
        callback(null, args)
    }
}
app.post('/nodeData', jayson.server(nodeData).middleware())
app.all('/', (req, res) => {

    let message = req.body.message
    let ip = req.connection.remoteAddress
    let time = new Date()
    storeData(message)
    
    // io.emit(topic, data)
    res.json(message)
})
app.get('/testing', () => {
    return "<button>Click</button>"
})
// Setup Http Server
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET","POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
})

function serializing() {
    try {
        const Binding = autoDetect()
        const port = new SerialPort({ 
            path: 'COM11', 
            baudRate: 9600,
            autoOpen: false
        })
        
        port.open(function (err) {
            if (err) {
                console.log('Error opening port: ', err.message)
            }
        })
        
        port.on('open', function() {
            console.log("Port Opened")
        })
        const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
        const devices = device.get()
    
        function logsParser(result){
            console.log(result)
            if(result[24] == '*'){
                let converted = {
                    'id': result[0], 
                    'lat': result[1], 
                    'lng': result[2], 
                    'alt': result[3], 
                    'sog': result[4], 
                    'cog': result[5], 
                    'accx': result[6], 
                    'accy': result[7], 
                    'accz': result[8], 
                    'gyrox': result[9], 
                    'gyroy': result[10], 
                    'gyroz': result[11], 
                    'magx': result[12], 
                    'magy': result[13], 
                    'magz': result[14], 
                    'roll' : result[15],
                    'pitch' : result[16],
                    'yaw' : result[17],
                    'suhu': 0, 
                    'rh': 0, 
                    'cahaya': 0, 
                    'vbat': result[18]/1000,
                    'rssi': result[19],
                    'snr' : result[20],
                    'cpu' : result[21],
                    'ram' : result[22],
                    'rom' : result[23],
                    'tail': result[24]
                }
                storeData(converted)
            } else {
                console.log("tail not matched",result[24])
            }
        }

        function write(id){
            console.log("write: "+id)
            let message = "GETPARAMETER,"+id+",*"
            port.write(message, function(err){
                if(err){
                    return console.log(err.message)
                }
            })
            // devices.forEach(item => {
            //     let id = item.name.slice(-1)
            //     console.log(id)
            //     let message = "GETPARAMETER,1,*"
            //     port.write(message, function(err){
            //         if(err){
            //             return console.log(err.message)
            //         }
            //         console.log("Sent")
            //     })
            // });

            console.log("Writed.")
        }

        parser.on('data', function(value) {
            let result = value.split(",")
            logsParser(result)
            let next_id = devices.filter(item => item.name != result[0])[0].name.slice(-1);
            write(next_id)
        })
        write(devices[0].name.slice(-1))
        // setInterval(write, 5000);

        port.on('error', function(err) {
            console.log('Error: ', err.message)
        })
        
    } catch (error) {
        console.log(error)
    }
}

serializing()

function storeData(value){
    if(data.length > 10){
        data.shift()
    }
    let result = { times : new Date().toJSON(), ...value}
    data.push(result)
    logs.create(result)

    io.emit(topic, logs.getLatest())
}


// If a connection granted
io.on("connection", (socket) => {
//   console.log(`connection from : ${socket.id}`)
})

httpServer.listen(wsPort, () => {
    console.log(`Websocket listening on port ${wsPort}`)
})