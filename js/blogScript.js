
// Shuffle array function to randomize blogs
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Load collection buttons
function loadCollections(blogs) {
  const collections = ["dev", "politics", "travel", "food", "writing"];
  const container = document.getElementById('collections-container');
  container.innerHTML = ''; // Clear existing content

  collections.forEach(collection => {
    const button = document.createElement('button');
    button.classList.add('collection-item');
    button.textContent = collection.charAt(0).toUpperCase() + collection.slice(1);
    button.onclick = () => loadRandomBlogFromCollection(collection, blogs);
    container.appendChild(button);
  });
}

// Load random blog from the selected collection
function loadRandomBlogFromCollection(collection, blogs) {
  const blogEntries = Object.entries(blogs).filter(([key, blog]) => blog.collection === collection);
  if (blogEntries.length > 0) {
    const randomBlog = shuffle(blogEntries)[0]; // Pick one random blog
    displayBlog(randomBlog[1], randomBlog[0], collection, blogs); // Display selected blog
  }
}

// Display blog and load related blogs
function displayBlog(blog, blogId, collection, blogs) {
  document.title = blog.title + " | IT ZENATA";
  document.getElementById('blog-title').innerText = blog.title;
  document.getElementById('blog-content').innerText = blog.content;
  loadRelatedBlogs(blogId, collection, blogs);
}

// Load related blogs
function loadRelatedBlogs(currentBlogId, collection, blogs) {
  const relatedContainer = document.getElementById('related-blogs');
  const relatedTitle = document.getElementById('related-section-title');
  relatedContainer.innerHTML = ''; // Clear existing content

  // Filter blogs from the same collection, excluding the current blog
  const relatedBlogs = Object.entries(blogs).filter(([key, blog]) => blog.collection === collection && key !== currentBlogId);

  if (relatedBlogs.length > 0) {
    relatedTitle.innerText = "Sujets Connexes";
    // Shuffle and pick 3 random related blogs
    const randomBlogs = shuffle(relatedBlogs).slice(0, 3);
    randomBlogs.forEach(([key, blog]) => {
      createBlogCard(blog, key, relatedContainer);
    });
  } else {
    // Show blogs from other collections labeled "Autres"
    relatedTitle.innerText = "Autres";
    const otherBlogs = Object.entries(blogs).filter(([key, blog]) => blog.collection !== collection && key !== currentBlogId);
    const randomOtherBlogs = shuffle(otherBlogs).slice(0, 3);
    randomOtherBlogs.forEach(([key, blog]) => {
      createBlogCard(blog, key, relatedContainer);
    });
  }
}

// Create a blog card element
function createBlogCard(blog, blogId, container) {
  const card = document.createElement('div');
  card.classList.add('blog-card');
  card.innerHTML = `
        <a href="blog-detail.html?id=${blogId}" class="read-more">
            <img src="${blog.image}" alt="${blog.title}" class="blog-card-image">
            <h3>${blog.title}</h3>
            <p>${blog.description}</p>
        </a>
    `;
  container.appendChild(card);
}

// Scroll functions for left and right buttons
function scrollLeft() {
  const container = document.getElementById('collections-container');
  container.scrollBy({
    left: -200,
    behavior: 'smooth'
  });
}

function scrollRight() {
  const container = document.getElementById('collections-container');
  container.scrollBy({
    left: 200,
    behavior: 'smooth'
  });
}

// Fetch blog data from JSON file and initialize page
document.addEventListener('DOMContentLoaded', function() {
  fetch('data/blogsData.json')
    .then(response => response.json())
    .then(blogs => {
      loadCollections(blogs);

      // Get the blog ID from the URL
      const blogId = new URLSearchParams(window.location.search).get('id');

      // Display the selected blog if ID is valid
      if (blogId && blogs[blogId]) {
        displayBlog(blogs[blogId], blogId, blogs[blogId].collection, blogs);
      } else {
        // Handle invalid or missing blog ID
        document.getElementById('blog-title').innerText = 'Blog not found';
        document.getElementById('blog-content').innerText = 'The blog you are looking for does not exist.';
      }
    })
    .catch(error => console.error('Error loading blog data:', error));
});
