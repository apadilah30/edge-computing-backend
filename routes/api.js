const express = require('express');
const router = express.Router();
const os = require('os')
const osu = require('os-utils');
function msToTime(duration) {
var seconds = Math.floor((duration % 1000) / 100),
    minutes = Math.floor((duration / 1000) % 60),
    hours = Math.floor((duration / (1000 * 60)) % 60),
    milliseconds = Math.floor((duration / (1000 * 60 * 60)) % 24);

hours = (hours < 10) ? "0" + hours : hours;
minutes = (minutes < 10) ? "0" + minutes : minutes;
seconds = (seconds < 10) ? "0" + seconds : seconds;

return hours + ":" + minutes + ":" + seconds;
}

router.get('/server-status', function(req, res, next) {
    try {
        let cpu_usage = 100;
        osu.cpuUsage(function(v){
            cpu_usage = v*100;
            let result = {
                specification : {
                    cpu : os.cpus()[0].model,
                    cpu_count : os.cpus().length,
                    ram : parseInt(os.totalmem()),
                    platform : osu.platform(),
                    uptime : msToTime(osu.sysUptime()),
                    protime : osu.processUptime()
                },
                statistics : {
                    total_ram : os.totalmem(),
                    free_ram : os.freemem(),
                    ram_percent : 100 * ((parseInt(os.totalmem())-parseInt(os.freemem()))/parseInt(os.totalmem())),
                    cpu_percent : cpu_usage
                }
            }
            res.json(result);
        });
    } catch(err) {
      console.error(`Error while getting server status `, err.message);
      next(err);
    }
});

module.exports = router;