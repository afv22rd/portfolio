import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';  

const firebaseConfig = {
    apiKey: "AIzaSyBOHzNRd0cwr37CNrJLWYjeXsuTpLSc-vw",
    authDomain: "easyparking-d43a9.firebaseapp.com",
    projectId: "easyparking-d43a9",
    storageBucket: "easyparking-d43a9.appspot.com",
    messagingSenderId: "843270292758",
    appId: "1:843270292758:web:7f633217719971f42bbc37",
    measurementId: "G-RZ7SGB34XS"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  document.getElementById('emailForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission

    const emailInput = document.querySelector('input[type="text"]');
    const emailInputGroup = document.getElementById('emailInput');
    const emailMessageDiv = document.getElementById('emailMessage');
    const email = emailInput.value;

    if (!email.includes('@') || !email.includes('.')) {
        emailInputGroup.classList.add('is-invalid');
        emailMessageDiv.textContent = 'Please enter a valid email address.';
        emailMessageDiv.classList.add('invalid-feedback');

        setTimeout(() => {
            emailInputGroup.classList.remove('is-invalid');
            emailMessageDiv.textContent = '';
            emailMessageDiv.classList.remove('invalid-feedback');
        }, 4000);
        return;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        emailInputGroup.classList.add('is-invalid');
        emailMessageDiv.textContent = 'Please enter a valid email address.';
        emailMessageDiv.classList.add('invalid-feedback');

        setTimeout(() => {
            emailInputGroup.classList.remove('is-invalid');
            emailMessageDiv.textContent = '';
            emailMessageDiv.classList.remove('invalid-feedback');
        }, 4000);
        return;
    }

    try {
      await addDoc(collection(db, 'emailSubscriptions'), {
        email: email,
        date: Timestamp.now()
      });
        emailInput.value = '';
        emailInputGroup.classList.remove('is-invalid');
        emailInputGroup.classList.add('is-valid');
        emailMessageDiv.textContent = 'Thank you for your support!';
        emailMessageDiv.classList.remove('invalid-feedback');
        emailMessageDiv.classList.add('valid-feedback');
        console.log('Email stored successfully');

        setTimeout(() => {
            emailInputGroup.classList.remove('is-valid');
            emailMessageDiv.textContent = '';
            emailMessageDiv.classList.remove('valid-feedback');
        }, 4000);
    } 
    
    catch (error) {
        console.error('Error storing email: ', error);
        alert('There was an error storing your email. Please try again later.');
    }
  });
