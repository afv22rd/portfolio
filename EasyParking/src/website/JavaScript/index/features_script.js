document.addEventListener('DOMContentLoaded', async function() {
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
});