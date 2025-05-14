// tracking.js - Create this file and include it in your website
document.addEventListener('DOMContentLoaded', function() {
  // Track service section clicks
  document.querySelectorAll('.service-box').forEach(function(box) {
    box.addEventListener('click', function() {
      const serviceName = this.querySelector('h1').innerText;
      gtag('event', 'service_click', {
        'service_name': serviceName
      });
    });
  });

  // Track project section clicks
  document.querySelectorAll('.projet-box').forEach(function(box) {
    box.addEventListener('click', function() {
      const projectName = this.querySelector('img').alt;
      gtag('event', 'project_click', {
        'project_name': projectName
      });
    });
  });

  // Track blog clicks
  document.querySelectorAll('.blog-box a').forEach(function(link) {
    link.addEventListener('click', function() {
      const blogTitle = this.querySelector('h1').innerText;
      gtag('event', 'blog_click', {
        'blog_title': blogTitle
      });
    });
  });

  // Track contact button clicks
  document.querySelectorAll('.contactUsLink').forEach(function(link) {
    link.addEventListener('click', function() {
      gtag('event', 'contact_click', {
        'contact_method': 'email'
      });
    });
  });

  // Track WhatsApp clicks
  document.querySelector('.whatsapp-link').addEventListener('click', function() {
    gtag('event', 'contact_click', {
      'contact_method': 'whatsapp'
    });
  });

  // Track social media clicks
  document.querySelectorAll('.social-icons a').forEach(function(link) {
    link.addEventListener('click', function() {
      const platform = this.querySelector('i').className.includes('linkedin') ? 'LinkedIn' :
                       this.querySelector('i').className.includes('github') ? 'GitHub' : 
                       this.querySelector('i').className.includes('twitter') ? 'Twitter' : 'Unknown';
      
      gtag('event', 'social_click', {
        'platform': platform
      });
    });
  });

  // Track navigation clicks
  document.querySelectorAll('.main-navigation a').forEach(function(link) {
    link.addEventListener('click', function() {
      const navItem = this.innerText;
      gtag('event', 'navigation_click', {
        'nav_item': navItem
      });
    });
  });

  // Track scroll depth
  let scrollDepths = [25, 50, 75, 90];
  let scrollDepthsReached = {};
  
  window.addEventListener('scroll', function() {
    const scrollPercentage = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);
    
    scrollDepths.forEach(function(depth) {
      if (scrollPercentage >= depth && !scrollDepthsReached[depth]) {
        scrollDepthsReached[depth] = true;
        gtag('event', 'scroll_depth', {
          'depth': depth + '%'
        });
      }
    });
  });

  // Track time on page when user leaves
  let startTime = new Date();
  window.addEventListener('beforeunload', function() {
    const timeSpent = Math.round((new Date() - startTime) / 1000);
    gtag('event', 'time_on_page', {
      'seconds': timeSpent,
      'page': window.location.pathname
    });
  });

  // For blog detail pages - track blog post views
  if (window.location.pathname.includes('blog-detail.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    
    if (blogId) {
      gtag('event', 'blog_view', {
        'blog_id': blogId,
        'blog_title': document.getElementById('blog-title')?.textContent || ''
      });
    }
  }
});