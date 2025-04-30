
async function loadBlogData() {
  try {
    // Charger le fichier JSON
    const response = await fetch('data/ai.json');
    
    if (!response.ok) {
      throw new Error('Impossible de charger le fichier JSON');
    }
    
    const data = await response.json();
    const blogsContainer = document.getElementById('dynamic-blogs-container');
    
    // Vider le conteneur avant d'ajouter de nouveaux blogs
    blogsContainer.innerHTML = '';
    
    // Parcourir tous les éléments du JSON et créer un blog-box pour chacun
    for (const blogId in data) {
      if (data.hasOwnProperty(blogId)) {
        const blogData = data[blogId];
        
        // Créer les éléments HTML pour chaque blog
        const blogBox = document.createElement('div');
        blogBox.className = 'blog-box';
        
        const blogLink = document.createElement('a');
        blogLink.href = `blog-detail.html?id=${blogId}`;
        
        const blogImg = document.createElement('img');
        blogImg.src = blogData.image || `./assets/images/blogs/${blogId}.webp`;
        blogImg.alt = blogData.collection || blogId;
        
        const blogTitle = document.createElement('h1');
        blogTitle.style.color = '#fff';
        blogTitle.textContent = blogData.title;
        
        const blogDesc = document.createElement('p');
        blogDesc.style.color = '#fff';
        blogDesc.textContent = blogData.description;
        
        // Assembler les éléments
        blogLink.appendChild(blogImg);
        blogLink.appendChild(blogTitle);
        blogLink.appendChild(blogDesc);
        blogBox.appendChild(blogLink);
        
        // Ajouter le blog au conteneur
        blogsContainer.appendChild(blogBox);
      }
    }
    
    // Si aucun blog n'a été trouvé, afficher un message
    if (blogsContainer.children.length === 0) {
      blogsContainer.innerHTML = '<p style="color: white; text-align: center;">Aucun blog disponible pour le moment.</p>';
    }
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
    const blogsContainer = document.getElementById('dynamic-blogs-container');
    blogsContainer.innerHTML = '<p style="color: white; text-align: center;">Erreur lors du chargement des blogs.</p>';
  }
}

// Exécuter la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', loadBlogData);
