const express = require('express');
const router = express.Router();
const logs = require('../services/logs');
const exportUser = require('../services/export');

/* GET logs listing. */
router.get('/', function(req, res, next) {
  try {
    res.json(logs.getLatest());
  } catch(err) {
    console.error(`Error while getting logs `, err.message);
    next(err);
  }
});

router.get('/coords', function(req, res, next) {
  try {
    res.json(logs.getCoords());
  } catch(err) {
    console.error(`Error while getting logs `, err.message);
    next(err);
  }
});

router.get('/clear', function(req, res, next) {
  try {
    res.json(logs.empty());
  } catch(err) {
    console.error(`Error while getting logs `, err.message);
    next(err);
  }
});

/* POST quote */
router.post('/', function(req, res, next) {
    try {
      res.json(logs.create(req.body));
    } catch(err) {
      console.error(`Error while adding quotes `, err.message);
      next(err);
    }
});

router.get('/downloadExcel', exportUser);

module.exports = router;