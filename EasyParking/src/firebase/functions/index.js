const cors = require('cors')({ origin: 'https://easy-parking.app/' });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const fs = require("fs");
const path = require("path");
admin.initializeApp(); // Initialize Firebase 

const db = admin.firestore();

// SendGrid API Key
const SENDGRID_API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;  
sgMail.setApiKey(SENDGRID_API_KEY);

// Admin email
const ADMIN_EMAIL = functions.config().admin.email;

// Firestore trigger to send a thank you email
exports.sendThankYouEmail = functions.firestore
    // Trigger on document creation in the emailSubscriptions collection
    .document('emailSubscriptions/{docId}')
    .onCreate((snap) => {
        const email = snap.data().email;

        const msg = {
            to: email,
            from: ADMIN_EMAIL, // Replace with your email address
            templateId: TEMPLATE_ID,
            dynamic_template_data: {
                subject: 'Thank you for subscribing!',
                name: email.substring(0, email.lastIndexOf('@')),
                email: 'easyparking@support.com'
            }
        };

        return sgMail.send(msg)
            .then(() => {
                console.log('Thank you email sent successfully to:', email);
            })
            .catch((error) => {
                console.error('Error sending email:', error);
            });
    });

// Store email in Firestore and check if email already exists
exports.storeEmail = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        const { email } = req.body;

        if (!email || !email.includes('@') || !email.includes('.')) {
            return res.status(400).send('Invalid email address.');
        }

        try {
            const emailCollection = db.collection('emailSubscriptions');
            const checkQuerySnapshot = await emailCollection.where('email', '==', email).get();

            if (!checkQuerySnapshot.empty) {
                return res.status(409).send('This email is already registered.');
            }

            const q = emailCollection.orderBy('id', 'desc').limit(1);
            const querySnapshot = await q.get();

            let newId = 1; // Start at 1 if this is the first document

            if (!querySnapshot.empty) {
                const lastDoc = querySnapshot.docs[0];
                const lastId = lastDoc.data().id;
                newId = lastId + 1; // Increment the ID by 1
            }

            await emailCollection.doc(newId.toString()).set({
                id: newId,
                uid: uid,
                email: email,
                date: admin.firestore.Timestamp.now(),
            });

            return res.status(200).send('Email stored successfully.');
        } catch (error) {
            console.error('Error storing email: ', error);
            return res.status(500).send('Internal Server Error');
        }
    });
});

exports.getGeoJSON = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      const geojsonPath = path.join(__dirname, "map.geojson");
      const geojson = JSON.parse(fs.readFileSync(geojsonPath, "utf8"));
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(geojson);
    });
  });
  
// Define the Cloud Function to get Google Maps API key
exports.getGoogleMapsApiKey = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const apiKey = functions.config().googlemaps.key;
        res.json({ key: apiKey });
    });
});

// Store question in Firestore
exports.storeQuestion = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST'){
            return res.status(405).send('Method Not Allowed');
        }

        const { email, question, issue } = req.body;

        if (!email || !email.includes('@') || !email.includes('.')) {
            return res.status(400).send('Invalid email address.');
        }

        if (!question) {
            return res.status(400).send('Question is required.');
        }

        const questionCollection = db.collection('discussionQuestions');

        try {
            await db.runTransaction(async (transaction) => {
                const newDoc = questionCollection.doc();
                transaction.set(newDoc, {
                    id: newDoc.id,
                    email: email,
                    question: question,
                    issue: issue,
                    date: admin.firestore.Timestamp.now(),
                });
            });
            
            return res.status(200).send('Question stored successfully.');
            } catch (error) {
                console.error('Error storing question: ', error);
                return res.status(500).send('Internal Server Error');
            }
        });
    });

// Retrieve questions from Firestore
exports.getQuestions = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'GET') {
            return res.status(405).send('Method Not Allowed');
        }

        try {
            const questionCollection = db.collection('discussionQuestions').orderBy('date', 'desc');
            const snapshot = await questionCollection.get();
            const questions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            res.status(200).json(questions);
        } catch (error) {
            console.error('Error retrieving questions: ', error);
            res.status(500).send('Internal Server Error');
        }
    });
});