let menuIcon = document.querySelector('#menu-icon');
let naBar = document.querySelector('.navbar');
let navLinks = document.querySelectorAll('header nav a');  // Updated to select all nav links

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    naBar.classList.toggle('active');
    console.log(naBar.style);
}

// Optional: Add an event listener to close the menu when a link is clicked
navLinks.forEach(link => {
    link.onclick = () => {
        menuIcon.classList.remove('bx-x');
        naBar.classList.remove('active');
    };
});
