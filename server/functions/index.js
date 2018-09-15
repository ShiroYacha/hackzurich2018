const firebase = require("firebase");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const firebaseKey = require("./firebase_key.json");
// Required for side-effects
require("firebase/firestore");

admin.initializeApp(firebaseKey);

var db = admin.firestore();

var htmlPage = (msg) => {return "<html>\n" +
    "<head>\n" +
    "<style>\n" +
    ".blue{\n" +
    "background-color:#49b1d1\n" +
    "}\n" +
    ".white{\n" +
    "color:white;\n" +
    "text-align:center;\n" +
    "font-size:120px;\n" +
    "}\n" +
    "</style>\n" +
    "</head>\n" +
    "<body class=\"blue\">\n" +
    "<br><br><br><br>\n" +
    "<h1 class=\"white\">"+msg+"</h1>\n" +
    "\n" +
    "</body>\n" +
    "\n" +
    "\n" +
    "</html>\n";}
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.accept = functions.https.onRequest((request, response) => {
    db.collection('booking').doc('demo').set({status: 'accept'});
    response.send(htmlPage("Appointment Confirmed!"));
});

exports.decline = functions.https.onRequest((request, response) => {
    db.collection('booking').doc('demo').set({status: 'decline'});
    response.send(htmlPage("Appointment Declined!"));
});

