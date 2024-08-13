document.addEventListener('DOMContentLoaded', function() {
    const headerLogo = document.getElementById('logo-h');
    const footerLogo = document.getElementById('logo-f');
    const logophone = document.getElementById('logo-phone');
    const themeSwitch = document.getElementById('flexSwitchCheckDefault');
    const themeSwitchF = document.getElementById('flexSwitchCheckDefault-f');
    const mainHero = document.querySelector('.main-hero');
    const themeIcon = document.getElementById('theme-icon');
    const themeIconF = document.getElementById('theme-icon-f');
    const newtabIcons = document.querySelectorAll('.newtab-icon');

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
  });