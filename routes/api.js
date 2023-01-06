const express = require('express');
const router = express.Router();
const os = require('os')

router.get('/server-status', function(req, res, next) {
    try {
        let result = {
            specification : {
                cpu : os.cpus()[0].model,
                cpu_count : os.cpus().length,
                ram : os.totalmem()
            },
            statistics : {
                total_ram : os.totalmem(),
                free_ram : os.freemem()
            }
        }
        res.json(result);
    } catch(err) {
      console.error(`Error while getting server status `, err.message);
      next(err);
    }
});

module.exports = router;