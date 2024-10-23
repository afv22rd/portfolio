document.addEventListener('DOMContentLoaded', async function() {
    const headerLogo = document.getElementById('logo-h');
    const logophone = document.getElementById('logo-phone');
    const themeSwitch = document.getElementById('flexSwitchCheckDefault');
    const themeSwitchF = document.getElementById('flexSwitchCheckDefault-f');
    const themeIcon = document.getElementById('theme-icon');
    const themeIcon2 = document.getElementById('theme-icon2')
    const themeIconF = document.getElementById('theme-icon-f');
    const newtabIcons = document.querySelectorAll('.newtab-icon');
    const radioIcon = document.querySelectorAll('.howItWorksIcon');
    const footerBg = document.getElementById('footer-bg');
    const questionToast = document.getElementById('questionToast');

    // Check if the current page is the FAQ page
    const currentPage = window.location.pathname;
    const homeLink = document.getElementById('home-link');
    const faqLink = document.getElementById('faq-link');
    const aboutLink = document.getElementById('about-link');

    // folded nav-bar
    const homeLinkF = document.getElementById('home-link-folded');
    const faqLinkF = document.getElementById('faq-link-folded');
    const aboutLinkF = document.getElementById('about-link-folded');

    if (currentPage.includes('faq')) {
      homeLink.classList.remove('active');
      aboutLink.classList.remove('active');
      faqLink.classList.add('active');

      homeLinkF.classList.remove('active');
      aboutLinkF.classList.remove('active');
      faqLinkF.classList.add('active');
      
    } else if (currentPage.includes('about')) {
      homeLink.classList.remove('active');
      faqLink.classList.remove('active');
      aboutLink.classList.add('active');

      homeLinkF.classList.remove('active');
      faqLinkF.classList.remove('active');
      aboutLinkF.classList.add('active');
     
    }
    
    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme ? savedTheme : document.documentElement.getAttribute('data-bs-theme');
    
    // Apply the saved theme
    document.documentElement.setAttribute('data-bs-theme', theme);
    themeSwitch.checked = theme === 'dark';
  
    function updateLogos(theme) {
      // Determine the new icon based on the theme
      const newIconSrcF = theme === 'dark' ? './images/dark-mode-moon2.svg' : './images/light-mode-sun.svg';
  
      // Add the spin-out class to the current icons
      themeIcon.classList.add('spin-out');
      themeIcon2.classList.add('spin-out');
      themeIconF.classList.add('spin-out'); // For the second switch if applicable
    
      // Wait for the spin-out animation to complete
      setTimeout(() => {
        themeIcon.style.opacity = theme === 'dark' ? 1 : 0;
        themeIcon2.style.opacity = theme === 'light' ? 1 : 0;
  
        // Change the icon's source
        themeIcon.src = './images/dark-mode-moon2.svg';
        themeIcon2.src = './images/light-mode-sun.svg';
        themeIconF.src = newIconSrcF;
    
        // Remove the spin-out class and add the spin-in class
        themeIcon.classList.remove('spin-out');
        themeIcon2.classList.remove('spin-out');
        themeIconF.classList.remove('spin-out');
        themeIcon.classList.add('spin-in');
        themeIcon2.classList.add('spin-in');
        themeIconF.classList.add('spin-in');
    
        // Remove the spin-in class after the animation is done
        setTimeout(() => {
          themeIcon.classList.remove('spin-in');
          themeIcon2.classList.remove('spin-in');
          themeIconF.classList.remove('spin-in');
        }, 300); // Match this duration with the CSS transition duration
      }, 300); // Match this duration with the CSS transition duration
    
      // Your existing logic to update other elements based on the theme
      if (theme === 'dark') {
        headerLogo.src = './images/weblogo_darkmode.svg';
        logophone.src = './images/weblogo_darkmode.svg';
        footerBg.src = './images/blobs/waves-dark.png';
    
        // Update all newtab icons
        newtabIcons.forEach(icon => {
          icon.src = './images/newtab.svg';
        });
    
        // Update all radio icons to dark
        radioIcon.forEach(icon => {
          icon.src = icon.src.replace('.svg', '-dark.svg');
        });
    
      } else {
        headerLogo.src = './images/weblogo_lightmode.svg';
        logophone.src = './images/weblogo_lightmode.svg';
        footerBg.src = './images/blobs/waves.png';
    
        // Update all newtab icons
        newtabIcons.forEach(icon => {
          icon.src = './images/newtab-light.svg';
        });
    
        // Update all radio icons to light
        radioIcon.forEach(icon => {
          icon.src = icon.src.replace('-dark.svg', '.svg');
        });
      }
    }
    
    function updateTheme(){
      const currentTheme = document.documentElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-bs-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateLogos(newTheme);
    }
  
    themeSwitch.addEventListener('change', updateTheme);
    themeSwitchF.addEventListener('change', updateTheme);
    updateLogos(theme);

  document.getElementById('questionForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission
  
    const emailInput = document.querySelector('input[type="email"]');
    const emailInputGroup = document.getElementById('questionEmail');
    const emailMessageDiv = document.getElementById('questionEmailMessage');
    const questionInput = document.getElementById('question')
    const issueDescription = document.getElementById('issue-description');
    const email = emailInput.value;
    const question = questionInput.value;
    const issue = issueDescription.value;

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
      const response = await fetch('https://us-central1-easyparking-d43a9.cloudfunctions.net/storeQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, question, issue }),
      });

      if (response.ok) {
        // Close the modal using Bootstrap's modal hide method
        const modalBootstrap = bootstrap.Modal.getInstance(exampleModal); // Get the modal instance
        modalBootstrap.hide();
        questionInput.value = ''; // Clear the question input
        issueDescription.value = ''; // Clear the issue description input

        // Delay to allow modal to close before showing the toast
        setTimeout(() => {
          const toastBootstrap = bootstrap.Toast.getOrCreateInstance(questionToast);
          toastBootstrap.show();
        }, 500); // Adjust delay as needed 
      } else {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('An error occurred while submitting your question. Please try again later.');
    }
  });
});

