document.addEventListener('DOMContentLoaded', async function() {
  const headerLogo = document.getElementById('logo-h');
  const logophone = document.getElementById('logo-phone');
  const themeSwitch = document.getElementById('flexSwitchCheckDefault');
  const themeSwitchF = document.getElementById('flexSwitchCheckDefault-f');
  const mainHero = document.querySelector('.main-hero');
  const themeIcon = document.getElementById('theme-icon');
  const themeIcon2 = document.getElementById('theme-icon2')
  const themeIconF = document.getElementById('theme-icon-f');
  const newtabIcons = document.querySelectorAll('.newtab-icon');
  const radioIcon = document.querySelectorAll('.howItWorksIcon');
  const footerBg = document.getElementById('footer-bg');

  const colorsLight = ["#bad9ee", "#9ec9e7", "#75b2dd"];
  const colorsDark = ["#667a91", "#334d6c", "#002147"];
  const bottomClasses = ["bottom-1", "bottom-2", "bottom-3"];
  const topClasses = ["top-1", "top-2", "top-3"];

  // Check if the current page is the FAQ page
  const currentPage = window.location.pathname;
  const homeLink = document.getElementById('home-link');
  const faqLink = document.getElementById('faq-link');
  const aboutLink = document.getElementById('about-link');

  // folded nav-bar
  const homeLinkF = document.getElementById('home-link-folded');
  const faqLinkF = document.getElementById('faq-link-folded');
  const aboutLinkF = document.getElementById('about-link-folded');

  if (currentPage.includes('index') || currentPage === '/') {
    faqLink.classList.remove('active');
    aboutLink.classList.remove('active');
    homeLink.classList.add('active');
    
    faqLinkF.classList.remove('active');
    aboutLinkF.classList.remove('active');
    homeLinkF.classList.add('active');
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
      mainHero.classList.add('dark');
  
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
      footerBg.src = './images/blobs/waves.png';
      mainHero.classList.remove('dark');
  
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
  const labels = document.querySelectorAll('label[for^="listGroupCheckableRadios"]');

  // Preload all images
  radios.forEach(radio => {
    const img = new Image();
    img.src = radio.getAttribute('data-src');
  });

  labels.forEach((label) => {
    label.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent scrolling

      const radio = document.getElementById(label.getAttribute('for'));
      radio.checked = true; // Manually check the radio button

      // Get the new image source
      const newSrc = radio.getAttribute('data-src');

      // Preload the new image
      const img = new Image();
      img.src = newSrc;

      // Once the image has fully loaded, perform the transition
      img.onload = () => {
        radioImage.classList.add('fade-out');

        setTimeout(() => {
          radioImage.src = newSrc;
          radioImage.classList.remove('fade-out');
        }, 200);
      };
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

