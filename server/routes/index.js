var express = require('express');
var fetch = require("node-fetch");
const fs = require('fs');
var router = express.Router();

let apimedic_symptoms_file = fs.readFileSync('./data/apimedic_symptoms.json');
let apimedic_symptoms = JSON.parse(apimedic_symptoms_file).apimedic_symptoms;

let apimedic_diagnostics_file = fs.readFileSync('./data/apimedic_diagnostics.json');
let apimedic_diagnostics = JSON.parse(apimedic_diagnostics_file).apimedic_diagnostics;

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

                firestore.collection('symptoms').doc('demo').set({ results: symptoms });

                if (symptoms.length == 1) {
                    console.log('diagnosing = ' + symptoms[0].name)
                    const diagnotics = diagnosticSymptom(symptoms[0]);
                    if (diagnotics.length > 0) {
                        // take the top 5 issues
                        const top5diagnostics = diagnotics.slice(0, 5);
                        const top5issues = top5diagnostics.map(d => d.issue);
                        console.log('top 5 diagnostics issues = ', top5issues);
                        firestore.collection('issues').doc('demo').set({ results: top5issues });
                        // take the top issue's specialisation
                        const specialisations = diagnotics[0].specialisation;
                        console.log('top issue specialisation', specialisations);
                        // further analysis
                        proposeDrugsFromIssues(top5issues);
                        proposeHealthcareProviderFromSpecialisations(specialisations);
                    }
                }
                else {
                    firestore.collection('issues').doc('demo').set({ results: null });
                }
            }
        }

    });
});

proposeDrugsFromIssues = (issues) => {
    const issueDrugMaps = {
        '104': ['aspirin', 'naproxen', 'indomethacin'],
    };
    var found = false;
    issues.forEach(issue => {
        if (issueDrugMaps[issue.id]) {
            found = true;
            const promises = [];
            issueDrugMaps[issue.id].forEach(n=>{
                promises.push(fetch(`https://health.axa.ch/hack/api/drugs?name=${n}`, {
                    headers: {
                        Authorization: 'bashful bear'
                    }
                }).then(res1 => res1.json()));
            });
            Promise.all(promises).then(results=>{
                var flatterned = [].concat.apply([], results);
                console.log('found drugs', flatterned);
                // post processing on top 5 drugs
                const top5drugs = [];
                flatterned.splice(0,5).forEach(d=>{
                    top5drugs.push({
                        name: d.title,
                        authHolder: d.authHolder,
                        description: d.substances.join(',')
                    });
                });
                firestore.collection('drugs').doc('demo').set({ results: top5drugs });
            })
        }
    });
    if(!found){
        firestore.collection('drugs').doc('demo').set({ results: null });
    }
}

proposeHealthcareProviderFromSpecialisations = (specialisations) => {

    const specialisationMap = {'General practice': 'physicians'};
    const mappedSpecialisation = [];
    specialisations.forEach(s=>{
        if(specialisationMap[s.name]){
            s.name = specialisationMap[s.name];
        }
    })

    // fetch('https://health.axa.ch/hack/api/care-providers/categories', {
    //     headers: {
    //       Authorization: 'bashful bear'
    //     }
    // }).then(res1 => res1.json()).
}

proposeSymptoms = (query) => {
    const symptoms = [];
    apimedic_symptoms.forEach(symptom => {
        const symptomName = symptom.name;
        if (symptomName.toLowerCase().includes(query)) {
            symptoms.push(symptom);
        }
    });
    return symptoms.slice(0, 5);
}

diagnosticSymptom = (symptom) => {
    var diagnostics = [];
    apimedic_diagnostics.forEach(d => {
        if (d.symptom == symptom.id) {
            diagnostics = d.results.map(r => {
                var r = { ...r };
                r.issue.symptom = symptom.name;
                return r;
            });
            return;
        }
    })
    return diagnostics;
}

module.exports = router;
