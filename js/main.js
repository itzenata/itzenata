document.addEventListener('DOMContentLoaded', function () {
    const instance = document.querySelector('.swiper.blog-slider');
    const box = instance.querySelector('.swiper-wrapper.blog-container');
    const prevArrow = instance.querySelector('.arrow-prev');
    const nextArrow = instance.querySelector('.arrow-next');
  
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    const maxScrollWidth = box.scrollWidth - box.clientWidth;
  
    // Arrow click functionality
    nextArrow.addEventListener('click', function () {
      const x = (box.clientWidth / 2) + box.scrollLeft - 10;
      box.scrollTo({
        left: x,
        behavior: 'smooth'
      });
    });
  
    prevArrow.addEventListener('click', function () {
      const x = box.scrollLeft - (box.clientWidth / 2) + 10;
      box.scrollTo({
        left: x,
        behavior: 'smooth'
      });
    });
  
    // Dragging functionality
    box.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - box.offsetLeft;
      scrollLeft = box.scrollLeft;
      box.classList.add('dragging');
    });
  
    box.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const x = e.pageX - box.offsetLeft;
      const walk = (x - startX) * 2; // Multiplied for more scroll speed
      box.scrollLeft = scrollLeft - walk;
    });
  
    box.addEventListener('mouseup', () => {
      isDragging = false;
      box.classList.remove('dragging');
    });
  
    box.addEventListener('mouseleave', () => {
      isDragging = false;
      box.classList.remove('dragging');
    });
  
    // Toggle arrows based on scroll position
    function toggleArrows() {
      if (box.scrollLeft === 0) {
        prevArrow.classList.add('disabled');
      } else if (box.scrollLeft >= maxScrollWidth) {
        nextArrow.classList.add('disabled');
      } else {
        prevArrow.classList.remove('disabled');
        nextArrow.classList.remove('disabled');
      }
    }
  
    box.addEventListener('scroll', toggleArrows);
    toggleArrows();
  });
  const blogWrapper = document.querySelector('.blog-wrapper');

  window.onload = function() {
    const leftSwipeBtn = document.getElementById('left-swipe');
    const rightSwipeBtn = document.getElementById('right-swipe');
    const blogWrapper = document.querySelector('.blog-wrapper');
    const blogContainer = document.querySelector('.blog-container');

    // Amount to scroll on each swipe
    const scrollAmount = blogWrapper.clientWidth * 0.9; // 90% of the visible container width

    // Function to update button visibility based on scroll position
    function updateButtonVisibility() {
        const maxScrollLeft = blogContainer.scrollWidth - blogWrapper.clientWidth;
        
        // Hide the left button if we're at the very start
        if (blogWrapper.scrollLeft <= 0) {
            leftSwipeBtn.style.display = 'none';
        } else {
            leftSwipeBtn.style.display = 'block';
        }

        // Hide the right button if we've reached the end
        if (blogWrapper.scrollLeft >= maxScrollLeft - 1) { // Adding buffer for float rounding errors
            rightSwipeBtn.style.display = 'none';
        } else {
            rightSwipeBtn.style.display = 'block';
        }
    }

    // Initially hide the left button if we're at the start
    updateButtonVisibility();

    leftSwipeBtn.addEventListener('click', () => {
        blogWrapper.scrollBy({
            top: 0,
            left: -scrollAmount,
            behavior: 'smooth'
        });
        // Update buttons after scrolling
        setTimeout(updateButtonVisibility, 300);
    });

    rightSwipeBtn.addEventListener('click', () => {
        blogWrapper.scrollBy({
            top: 0,
            left: scrollAmount,
            behavior: 'smooth'
        });
        // Update buttons after scrolling
        setTimeout(updateButtonVisibility, 300);
    });

    // Ensure buttons update on manual scroll (e.g., via touch)
    blogWrapper.addEventListener('scroll', updateButtonVisibility);
};
console.log('Scroll Width:', blogWrapper.scrollWidth);
console.log('Client Width:', blogWrapper.clientWidth);
