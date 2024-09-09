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
  