const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser");
const osu = require('node-os-utils')
const devices = require('../services/devices')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/', function(req, res, next) {
    try {
        res.json(devices.get());
    } catch(err) {
        console.error(`Error`, err.message)
        next(err)
    }
})

router.get('/:id', function(req, res, next) {
    try {
        res.json(devices.show(req.params.id));
    } catch(err) {
        console.error(`Error`, err.message)
        next(err)
    }
})

router.post('/create', function(req, res) {
    try {
        let data = devices.create(req.body)
        res.json(data)
    } catch (err) {
        console.log('Error', err.message)
        return err.message
    }
})

router.post('/update', function(req, res) {
    try {
        let data = devices.update(req.body)
        res.json(data)
    } catch (err) {
        console.log('Error', err.message)
        return err.message
    }
})

router.post('/destroy/:id', function(req, res) {
    try {
        let data = devices.destroy(req.params.id)
        res.json(data)
    } catch (err) {
        console.log('Error', err.message)
        return err.message
    }
})

module.exports = router