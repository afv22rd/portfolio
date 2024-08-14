const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

// Replace with your SendGrid API Key
const SENDGRID_API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;  
sgMail.setApiKey(SENDGRID_API_KEY);

exports.sendThankYouEmail = functions.firestore
    .document('emailSubscriptions/{docId}')
    .onCreate((snap, context) => {
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
