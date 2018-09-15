var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({title: 'my title', name:'awesome even better 3'});
});

module.exports = router;
