document.addEventListener('DOMContentLoaded', async function() {
  // Theme switcher
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

  // Sort parking lots

  const listItems = document.querySelectorAll('.lot'); 
  const itemsArray = Array.from(listItems);

  itemsArray.sort((a, b) => {
    const valueA = a.querySelector('.lot-number').textContent.trim();
    const valueB = b.querySelector('.lot-number').textContent.trim();

    if (valueA === '0'){
      return -1;
    } 
    else if (valueB === '0'){
      return 1;
    }
    else {
      return parseInt(valueA) - parseInt(valueB);
    }
  });

  const lotsList = document.querySelector('.lots-list');
  itemsArray.forEach(item => {
    lotsList.appendChild(item);
  });

  // Google Maps API

    // Fetch the API key from the Firebase Cloud Function
    const response = await fetch('https://us-central1-easyparking-d43a9.cloudfunctions.net/getGoogleMapsApiKey');
    const data = await response.json();
    const apiKey = data.key;

    // Initialize the Google Maps script with the fetched API key
    (g => {
        var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
        b = b[c] || (b[c] = {});
        var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams,
            u = () => h || (h = new Promise(async (f, n) => {
                await (a = m.createElement("script"));
                e.set("libraries", [...r] + "");
                for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
                e.set("callback", c + ".maps." + q);
                a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
                d[q] = f;
                a.onerror = () => h = n(Error(p + " could not load."));
                a.nonce = m.querySelector("script[nonce]")?.nonce || "";
                m.head.append(a)
            }));
        d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
    })({
        key: apiKey, // Use the API key fetched from the Cloud Function
        v: "weekly",
        // Add other bootstrap parameters as needed, using camel case.
    });

  let map;

  async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { PinElement } = await google.maps.importLibrary("marker");

    // Fine Arts Lot
    const fineArtsGlyph = document.createElement("img");

    fineArtsGlyph.src = "./images/7.svg";
    
    const fineArtsGlyphPin = new PinElement({
      glyph: fineArtsGlyph,
    });
    //  Chapel Way Lot
    const chapelGlyph = document.createElement("img");

    chapelGlyph.src = "./images/4.svg";

    const chapelGlyphPin = new PinElement({
      glyph: chapelGlyph,
    });
    // Plains Rd Lot
    const plainsRdGlyph = document.createElement("img");

    plainsRdGlyph.src = "./images/25.svg";

    const plainsRdGlyphPin = new PinElement({
      glyph: plainsRdGlyph,
    });
    // Keaney
    const keaneyGlyph = document.createElement("img");

    keaneyGlyph.src = "./images/26.svg";

    const keaneyGlyphPin = new PinElement({
      glyph: keaneyGlyph,
    });
    // Plains South
    const plainsSouthGlyph = document.createElement("img");

    plainsSouthGlyph.src = "./images/31.svg";

    const plainsSouthGlyphPin = new PinElement({
      glyph: plainsSouthGlyph,
    });

    map = new Map(document.getElementById("map"), {
      center: { lat: 41.486028, lng: -71.530732 },
      zoom: 15,
      mapId: "2b0fbf90c6f27f7f",
      mapTypeControl: false,
    });

    const geoJsonUrl = "https://us-central1-easyparking-d43a9.cloudfunctions.net/getGeoJSON";

    fetch(geoJsonUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(geoJsonData => {
        map.data.addGeoJson(geoJsonData);
      })
      .catch(error => {
        console.error("Error fetching GeoJSON:", error);
      });

    map.data.setStyle({
      fillColor: '#D0A627',
      strokeWeight: 1,
      fillOpacity: 0.6,
      strokeColor: '#C79316'
    });

    const markerFA = new AdvancedMarkerElement({
      map: map,
      position: { lat: 41.488450, lng: -71.522163},
      content: fineArtsGlyphPin.element,
      title: "Fine Arts Lot",
      gmpClickable: true,
    });

    const markerCW = new AdvancedMarkerElement({
      map: map,
      position: { lat: 41.485569, lng: -71.522679},
      content: chapelGlyphPin.element,
      title: "Chapel Way Lot",
      gmpClickable: true,
    });

    const markerPR = new AdvancedMarkerElement({
      map: map,
      position: { lat: 41.490583, lng: -71.538161},
      content: plainsRdGlyphPin.element,
      title: "Plains Road Lot",
      gmpClickable: true,
    });

    const markerKeaney = new AdvancedMarkerElement({
      map: map,
      position: { lat: 41.483658, lng: -71.536081},
      content: keaneyGlyphPin.element,
      title: "Keaney Lot",
      gmpClickable: true,
    });

    const markerPS = new AdvancedMarkerElement({
      map: map,
      position: { lat: 41.489134, lng: -71.540769},
      content: plainsSouthGlyphPin.element,
      title: "Plains Road South Lot",
      gmpClickable: true,
    });

    // Function to create the content for the InfoWindow
    function createInfoContent(url) {
      return `
        <div id="infoWindowContent">
          <a href="${url}" target="_blank">View in Google Maps</a>
        </div>
      `;
    }
    
    const infoWindow = new google.maps.InfoWindow();
    
    // Function to add a click listener to a marker
    function addMarkerListener(marker, title, url) {
      marker.addListener("click", () => {
        infoWindow.setContent(createInfoContent(url));
        infoWindow.open(map, marker);
    
        infoWindow.addListener('domready', () => {
          const iwContainer = document.querySelector('.gm-style-iw-ch');
          
          if (iwContainer) {
            // Remove any existing title elements before adding the new one
            const existingTitle = iwContainer.querySelector('h5');
            if (existingTitle) {
              existingTitle.remove();
            }
    
            // Add the new title element
            const titleElement = document.createElement('h5');
            titleElement.textContent = title;
            iwContainer.prepend(titleElement);
          }
        });
      });
    }

    // Add listeners for each marker
    addMarkerListener(markerFA, "Fine Arts Lot", 
      "https://www.google.com/maps/place/Fine+Arts+Lot/@41.4881906,-71.5222189,509m/data=!3m1!1e3!4m6!3m5!1s0x89e5b9b4fe9867df:0xc3815a43d5a9f649!8m2!3d41.4882789!4d-71.5222811!16s%2Fg%2F11f_p2_brh?entry=ttu&g_ep=EgoyMDI0MDgyMy4wIKXMDSoASAFQAw%3D%3D");

    addMarkerListener(markerCW, "Chapel Way Lot", 
      "https://www.google.com/maps/place/Commuter+Lot/@41.4854366,-71.522822,202m/data=!3m1!1e3!4m14!1m7!3m6!1s0x89e5b9b4fe9867df:0xc3815a43d5a9f649!2sFine+Arts+Lot!8m2!3d41.4882789!4d-71.5222811!16s%2Fg%2F11f_p2_brh!3m5!1s0x89e5b9b36554528d:0x3573a515f97fe5c5!8m2!3d41.4855588!4d-71.5227038!16s%2Fg%2F11f3w9p99n?entry=ttu&g_ep=EgoyMDI0MDgyMy4wIKXMDSoASAFQAw%3D%3D");

    addMarkerListener(markerPR, "Plains Road Lot", 
      "https://www.google.com/maps/place/Ryan+Center+Lot,+Flagg+Rd,+Kingston,+RI+02881/@41.4897863,-71.5391906,453m/data=!3m1!1e3!4m14!1m7!3m6!1s0x89e5b9b4fe9867df:0xc3815a43d5a9f649!2sFine+Arts+Lot!8m2!3d41.4882789!4d-71.5222811!16s%2Fg%2F11f_p2_brh!3m5!1s0x89e5b84637afa7ed:0x52f0ea1ad50a2e68!8m2!3d41.4903061!4d-71.5386408!16s%2Fg%2F11b8tgqft4?entry=ttu&g_ep=EgoyMDI0MDgyMy4wIKXMDSoASAFQAw%3D%3D");

    addMarkerListener(markerKeaney, "Keaney Lot", 
      "https://maps.app.goo.gl/3VFtfNempiRtuQbw8");

    addMarkerListener(markerPS, "Plains Road South Lot", 
      "https://maps.app.goo.gl/7Q1nEMdNi9URwEwT7");
  }
  // Initialize the map when the page is first loaded
  initMap();
});

