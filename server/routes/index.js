var express = require('express');
var fetch = require("node-fetch");
var router = express.Router();

// firebase auth
const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: 'hackzurich2018',
  keyFilename: './firebase_key.json',
});
const settings = {/* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);

const document = firestore.doc('search/demo');

router.get('/run', (req, res, next) => {
  firestore.collection('search').doc('demo').onSnapshot(ref => {
    var data = ref.data();

    if (data) {
      console.log(data);
    }
  });

});

module.exports = router;
