// index.js

// Contains general functions used on the home page 

function scrollToSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
}

var scrollTop = 0;

// window.addEventListener('scroll', () => {
//   scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
//   console.log(`Vertical Scroll Position - ${scrollTop}`);
// });

