var express = require('express');
var fetch = require("node-fetch");
const fs = require('fs');
var router = express.Router();

let apimedic_symptoms_file = fs.readFileSync('./data/apimedic_symptoms.json');
let apimedic_symptoms = JSON.parse(apimedic_symptoms_file).apimedic_symptoms;

console.log(apimedic_symptoms);

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

            console.log('query = ' + data.query);

            var symptoms = proposeSymptoms(data.query);
            if (symptoms.length > 0) {

                console.log(symptoms);

                // remove old
                firestore.collection('symptoms').get().then(snapshot => {

                    if (snapshot.size == 0) return;

                    // delete old in batch
                    snapshot.docs.forEach((doc) => {
                        doc.ref.delete();
                    });
                }).then(() => {
                    // add new 
                    symptoms.slice(0, symptoms.length > 5 ? 5 : symptoms.length).forEach(s => {
                        firestore.collection('symptoms').add(s);
                    });
                });
            }
        }

    });
});

proposeSymptoms = (query) => {
    const symptoms = [];
    apimedic_symptoms.forEach(symptom => {
        const symptomName = symptom.name;
        if (symptomName.toLowerCase().includes(query)) {
            symptoms.push(symptom);
        }
    });
    return symptoms;
}

module.exports = router;
