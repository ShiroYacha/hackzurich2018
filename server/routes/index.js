var express = require('express');
var router = express.Router();

// firebase auth
const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: 'hackzurich2018',
  keyFilename: './firebase_key.json',
});
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

const document = firestore.doc('search/demo');


router.get('/', function(req, res, next) {

console.log("log1")

  // Read the document.
  document.get().then(doc => {
    // Document read successfully.
    res.send(doc)
  });

});

module.exports = router;
