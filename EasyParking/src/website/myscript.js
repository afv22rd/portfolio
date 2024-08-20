document.addEventListener('DOMContentLoaded', async function() {
  const headerLogo = document.getElementById('logo-h');
  const footerLogo = document.getElementById('logo-f');
  const logophone = document.getElementById('logo-phone');
  const themeSwitch = document.getElementById('flexSwitchCheckDefault');
  const themeSwitchF = document.getElementById('flexSwitchCheckDefault-f');
  const mainHero = document.querySelector('.main-hero');
  const themeIcon = document.getElementById('theme-icon');
  const themeIconF = document.getElementById('theme-icon-f');
  const newtabIcons = document.querySelectorAll('.newtab-icon');
  const radioIcon = document.querySelectorAll('.howItWorksIcon');

  const colorsLight = ["#bad9ee", "#9ec9e7", "#75b2dd"];
  const colorsDark = ["#667a91", "#334d6c", "#002147"];
  const bottomClasses = ["bottom-1", "bottom-2", "bottom-3"];
  const topClasses = ["top-1", "top-2", "top-3"];
  
  // Check local storage for saved theme
  const savedTheme = localStorage.getItem('theme');
  const theme = savedTheme ? savedTheme : document.documentElement.getAttribute('data-bs-theme');
  
  // Apply the saved theme
  document.documentElement.setAttribute('data-bs-theme', theme);
  themeSwitch.checked = theme === 'dark';
  themeSwitchF.checked = theme === 'dark';

  function updateLogos(theme){
    if (theme === 'dark') {
      headerLogo.src = './images/weblogo_darkmode.svg';
      logophone.src = './images/weblogo_darkmode.svg';
      mainHero.classList.add('dark');
      themeIcon.src = './images/light-mode-sun.svg';
      themeIconF.src = './images/light-mode-sun.svg';

      // Update all newtab icons
      newtabIcons.forEach(icon => {
        icon.src = './images/newtab.svg';
      });

      bottomClasses.forEach((className, index) => {
        document.querySelector(`.${className}`).setAttribute("fill", colorsDark[index]);
      });
      topClasses.forEach((className, index) => {
        document.querySelector(`.${className}`).setAttribute("fill", colorsDark[index]);
      });

       // Update all radio icons to dark
       radioIcon.forEach(icon => {
        icon.src = icon.src.replace('.svg', '-dark.svg');
      });

    } else {
      headerLogo.src = './images/weblogo_lightmode.svg';
      logophone.src = './images/weblogo_lightmode.svg';
      mainHero.classList.remove('dark');
      themeIcon.src = './images/dark-mode-moon.svg';
      themeIconF.src = './images/dark-mode-moon.svg';

      // Update all newtab icons
      newtabIcons.forEach(icon => {
        icon.src = './images/newtab-light.svg';
      });

      bottomClasses.forEach((className, index) => {
        document.querySelector(`.${className}`).setAttribute("fill", colorsLight[index]);
      });
      topClasses.forEach((className, index) => {
        document.querySelector(`.${className}`).setAttribute("fill", colorsLight[index]);
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

// Feature animations
const featuresSection = document.getElementById('features-section');
const features = document.querySelectorAll('.feature');

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

let animated = false;

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !animated) {
      animated = true;
      features.forEach((feature, index) => {
        setTimeout(() => {
          feature.classList.add('visible');
        }, index * 200); // 200ms delay between each feature
      });
      observer.unobserve(featuresSection);
    }
  });
}, observerOptions);

// Ensure features are hidden initially
features.forEach(feature => {
  feature.classList.remove('visible');
});

// Start observing
observer.observe(featuresSection);

  const radios = document.querySelectorAll('input[name="listGroupCheckableRadios"]');
  const radioImage = document.getElementById('howItWorksImg');

  // Preload all images
  radios.forEach(radio => {
    const img = new Image();
    img.src = radio.getAttribute('data-src');
  });

  radios.forEach(radio => {
    radio.addEventListener('change', function() {
      radioImage.classList.add('fade-out');

      setTimeout(() => {
        radioImage.src = `./images/${this.value}`;
        radioImage.classList.remove('fade-out');
      }, 300);
    });
  });

  document.getElementById("listGroupCheckableRadios1").checked = true;

  try {
    // Warm-up the Cloud Function with a GET request
    const response = await fetch('https://us-central1-easyparking-d43a9.cloudfunctions.net/storeEmail', {
        method: 'GET',
    });

    // Optional: handle the warm-up response if needed
    console.log('Cloud Function warmed up:', response.status);
  } catch (error) {
      console.error('Error warming up Cloud Function:', error);
  }

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

