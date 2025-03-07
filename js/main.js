const menuIcon = document.getElementById('menu-icon');
const navigation = document.querySelector('.main-navigation');
const whatsappLink = document.querySelector('.whatsapp-link'); // Select the WhatsApp icon

// Function to toggle between menu and close icons
menuIcon.addEventListener('click', () => {
  navigation.classList.toggle('show-menu'); // Toggle visibility class

  // Toggle the menu icon between 'bx-menu' and 'bx-x'
  if (menuIcon.classList.contains('bx-menu')) {
    menuIcon.classList.remove('bx-menu');
    menuIcon.classList.add('bx-x'); // This would be the close icon (replace with the appropriate close icon class)

    // Hide WhatsApp icon when the menu is open
    whatsappLink.style.display = 'none';
  } else {
    menuIcon.classList.remove('bx-x');
    menuIcon.classList.add('bx-menu'); // Switch back to the menu icon

    // Show WhatsApp icon when the menu is closed
    whatsappLink.style.display = 'flex'; // Use 'flex' to maintain the original styles
  }
});
