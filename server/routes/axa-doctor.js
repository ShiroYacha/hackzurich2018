var express = require('express');
var router = express.Router();

const fetch = require('node-fetch');

var input = "pharmacies"

/* GET axa listing. */
// searches the aspirin drug
router.get('/', function(req, res, next) {

  fetch('https://health.axa.ch/hack/api/care-providers/categories', {
    headers: {
      Authorization: 'bashful bear'
    }
  }).then(res1 => res1.json()).
  then(fetch_res =>{
      var id_cat = fetch_res.result.filter(n =>n.en==input)[0]._id
        var url = 'https://health.axa.ch/hack/api/care-providers?category='
        url += id_cat
        fetch(url, {
          headers: {
            Authorization: 'bashful bear'
          }
        }).then(res1 => res1.json()).
        then(fetch_res =>{res.send(fetch_res)}) ;

    })

  }) ;

module.exports = router;
