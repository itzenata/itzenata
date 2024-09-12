// Utility function to shuffle an array (Fisher-Yates Shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Load collection buttons dynamically
function loadCollectionButtons(blogs) {
  const collections = ["dev", "politics", "lifestyle", "sports", "design", "autre"];
  const collectionContainer = document.getElementById('collections-list');
  collectionContainer.innerHTML = ''; // Clear any existing buttons

  collections.forEach(collection => {
    const button = document.createElement('button');
    button.classList.add('collection-button');
    button.textContent = collection.charAt(0).toUpperCase() + collection.slice(1);
    button.onclick = () => loadRandomBlogByCollection(collection, blogs);
    collectionContainer.appendChild(button);
  });
}

// Load a random blog post based on the selected collection
function loadRandomBlogByCollection(collection, blogs) {
  const filteredBlogs = Object.entries(blogs).filter(([key, blog]) => blog.collection === collection);
  if (filteredBlogs.length > 0) {
    const randomBlog = shuffleArray(filteredBlogs)[0]; // Pick a random blog
    displayBlogContent(randomBlog[1], randomBlog[0], collection, blogs);
  }
}

// Display blog content and load related blogs
function displayBlogContent(blog, blogId, collection, blogs) {
  document.title = `${blog.title} | IT ZENATA`;
  document.getElementById('blog-title').innerText = blog.title;
  document.getElementById('blog-content').innerText = blog.content;
  document.getElementById('blog-date').innerText = `Date : ${blog.dateEcriture}`;

  loadRelatedBlogs(blogId, collection, blogs);
}

// Load related blogs based on the current blog collection
function loadRelatedBlogs(currentBlogId, collection, blogs) {
  const relatedBlogsContainer = document.getElementById('related-blogs');
  const relatedBlogsTitle = document.getElementById('related-section-title');
  relatedBlogsContainer.innerHTML = ''; // Clear existing related blogs

  const relatedBlogs = Object.entries(blogs).filter(([key, blog]) => blog.collection === collection && key !== currentBlogId);

  if (relatedBlogs.length > 0) {
    relatedBlogsTitle.innerText = "Sujets Connexes";
    const randomRelatedBlogs = shuffleArray(relatedBlogs).slice(0, 3); // Get 3 random blogs
    randomRelatedBlogs.forEach(([key, blog]) => createBlogCard(blog, key, relatedBlogsContainer));
  } else {
    loadOtherBlogs(currentBlogId, collection, blogs);
  }
}

// Load blogs from other collections when no related blogs are found
function loadOtherBlogs(currentBlogId, collection, blogs) {
  const otherBlogsContainer = document.getElementById('related-blogs');
  const relatedBlogsTitle = document.getElementById('related-section-title');
  relatedBlogsTitle.innerText = "Autres";

  const otherBlogs = Object.entries(blogs).filter(([key, blog]) => blog.collection !== collection && key !== currentBlogId);
  const randomOtherBlogs = shuffleArray(otherBlogs).slice(0, 3); // Get 3 random other blogs

  randomOtherBlogs.forEach(([key, blog]) => createBlogCard(blog, key, otherBlogsContainer));
}

// Create a blog card element
function createBlogCard(blog, blogId, container) {
  const blogCard = document.createElement('div');
  blogCard.classList.add('blog-card');
  blogCard.innerHTML = `
        <a href="blog-detail.html?id=${blogId}" class="read-more">
            <img src="${blog.image}" alt="${blog.title}" class="blog-card-image">
            <h3>${blog.title}</h3>
         
        </a>
    `;
  container.appendChild(blogCard);
}

// Scroll functions for the discover bar
function scrollCollectionsLeft() {
  const collectionContainer = document.getElementById('collections-list');
  collectionContainer.scrollBy({ left: -200, behavior: 'smooth' });
}

function scrollCollectionsRight() {
  const collectionContainer = document.getElementById('collections-list');
  collectionContainer.scrollBy({ left: 200, behavior: 'smooth' });
}

// Fetch blog data and initialize the page
document.addEventListener('DOMContentLoaded', function() {
  fetch('data/blogsData.json')
    .then(response => response.json())
    .then(blogs => {
      loadCollectionButtons(blogs);

      // Get the blog ID from the URL parameters
      const blogId = new URLSearchParams(window.location.search).get('id');

      // Display the blog if the ID is valid, otherwise load a default blog
      if (blogId && blogs[blogId]) {
        displayBlogContent(blogs[blogId], blogId, blogs[blogId].collection, blogs);
      }
    })
    .catch(error => console.error('Error loading blog data:', error));
});

// Selecting the menu toggle button and the menu itself
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

// Add click event listener to the hamburger icon
menuToggle.addEventListener('click', function () {
    // Toggle the 'active' class for the hamburger animation
    menuToggle.classList.toggle('active');
    // Toggle the 'show' class for the menu visibility
    navMenu.classList.toggle('show');
});


