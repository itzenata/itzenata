
const menuIcon = document.getElementById('menu-icon');
const navigation = document.querySelector('.main-navigation');

// Function to toggle between menu and close icons
menuIcon.addEventListener('click', () => {
  navigation.classList.toggle('show-menu'); // Toggle visibility class

  // Toggle the menu icon between 'bx-menu' and 'bx-x'
  if (menuIcon.classList.contains('bx-menu')) {
    menuIcon.classList.remove('bx-menu');
    menuIcon.classList.add('bx-x'); // This would be the close icon (replace with the appropriate close icon class)
  } else {
    menuIcon.classList.remove('bx-x');
    menuIcon.classList.add('bx-menu'); // Switch back to the menu icon

  }
});
