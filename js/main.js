

let menuIcon = document.querySelector('#menu-icon');
let naBar = document.querySelector('.navbar');
let navLinks = document.querySelector('header nav a');


menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    naBar.classList.toggle('active');
    console.log(naBar.style);
}

