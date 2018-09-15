var express = require('express');
var router = express.Router();

const fetch = require('node-fetch');



/* GET axa listing. */
// searches the aspirin drug
router.get('/', function(req, res, next) {
  // axa authenticate
  fetch('https://health.axa.ch/hack/api/care-providers?category=5b33a5142c9dd24355626319', {
    headers: {
      Authorization: 'bashful bear'
    }
  }).then(res1 => res1.json()).
  then(fetch_res =>{res.send(fetch_res)}) ;

});


module.exports = router;
