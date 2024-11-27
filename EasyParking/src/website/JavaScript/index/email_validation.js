document.addEventListener('DOMContentLoaded', async function() {
    // Email form submission
    document.getElementById('emailForm').addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent form submission
    
      const emailInput = document.querySelector('input[type="text"]');
      const emailInputGroup = document.getElementById('emailInput');
      const emailMessageDiv = document.getElementById('emailMessage');
      const email = emailInput.value;
      const loadingIcon = document.getElementById('loading-icon');
    
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
    
      const regex = /^[^\s@]+@uri\.edu$/;
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
          loadingIcon.style.display = 'block';
          const response = await fetch('https://us-central1-easyparking-d43a9.cloudfunctions.net/storeEmail', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email }),
          });
    
          const message = await response.text();
    
          if (response.status === 200) {
              emailInput.value = '';
              emailInputGroup.classList.remove('is-invalid');
              emailInputGroup.classList.add('is-valid');
              emailMessageDiv.textContent = 'Thank you for your support!';
              emailMessageDiv.classList.remove('invalid-feedback');
              emailMessageDiv.classList.add('valid-feedback');
          } 
          else if (response.status === 409) {
              emailInputGroup.classList.remove('is-valid');
              emailInputGroup.classList.add('is-valid');
              emailMessageDiv.textContent = message;
              emailMessageDiv.classList.remove('valid-feedback');
              emailMessageDiv.classList.add('valid-feedback');
          }  
          else {
              emailInputGroup.classList.remove('is-invalid');
              emailInputGroup.classList.add('is-invalid');
              emailMessageDiv.textContent = message;
              emailMessageDiv.classList.remove('invalid-feedback');
              emailMessageDiv.classList.add('invalid-feedback');
          }
          setTimeout(() => {
              emailInputGroup.classList.remove('is-valid');
              emailMessageDiv.textContent = '';
              emailMessageDiv.classList.remove('valid-feedback');
              loadingIcon.style.display = 'none';
          }, 4000);
      } catch (error) {
          console.error('Error submitting email: ', error);
          alert('There was an error submitting your email. Please try again later.');
      }
    });
});  