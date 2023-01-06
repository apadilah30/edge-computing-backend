const express = require('express');
const router = express.Router();
const logs = require('../services/logs');
const settings = require('../services/settings');
const exportUser = require('../services/export');

/* GET logs listing. */
router.get('/', function(req, res, next) {
  try {
    res.json(logs.getLatest(req.query));
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

router.get('/settings', function(req, res, next){
  try {
    res.json(settings.get());
  } catch(err) {
    console.error(`Error while adding quotes `, err.message);
    next(err);
  }
});

router.post('/settingsUpdate', function(req, res, next) {
  try {
    res.json(settings.update(req.body));
  } catch(err) {
    console.error(`Error while adding quotes `, err.message);
    next(err);
  }
})


module.exports = router;