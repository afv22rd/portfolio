const {onRequest} = require("firebase-functions/v2/https");
const cors = require('cors')({ origin: true });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

const db = admin.firestore();

// Replace with your SendGrid API Key
const SENDGRID_API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;  
sgMail.setApiKey(SENDGRID_API_KEY);

exports.sendThankYouEmail = functions.firestore
    .document('emailSubscriptions/{docId}')
    .onCreate((snap) => {
        const email = snap.data().email;

        const msg = {
            to: email,
            from: 'friasdevv@gmail.com', // Replace with your email address
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

exports.storeEmail = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method === 'GET') {
            // Handle the warm-up request
            return res.status(200).send('Cloud Function warmed up');
        }

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
