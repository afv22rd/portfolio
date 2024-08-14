import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getFirestore, collection, setDoc, getDocs, doc, addDoc, Timestamp, limit, orderBy, query, where} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';  

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
        // Check if email is in the database
        const emailCollection = collection(db, 'emailSubscriptions');
        const checkQuery = query(emailCollection, where('email', '==', email));
        const checkQuerySnapshot = await getDocs(checkQuery);

        if (!checkQuerySnapshot.empty) {
            emailInputGroup.classList.add('is-valid');
            emailMessageDiv.textContent = 'This email is already registered.';
            emailMessageDiv.classList.add('valid-feedback');

            setTimeout(() => {
                emailInputGroup.classList.remove('is-valid');
                emailMessageDiv.textContent = '';
                emailMessageDiv.classList.remove('valid-feedback');
            }, 4000);
            return;
        }

        // Get the current highest document ID
        const q = query(emailCollection, orderBy('id', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);

        let newId = 1; // Start at 1 if this is the first document

        if (!querySnapshot.empty) {
            const lastDoc = querySnapshot.docs[0];
            const lastId = lastDoc.data().id;
            newId = lastId + 1; // Increment the ID by 1
        }

        // Add the new document with the incremented ID as its name
        await setDoc(doc(db, 'emailSubscriptions', newId.toString()), {
            id: newId,
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