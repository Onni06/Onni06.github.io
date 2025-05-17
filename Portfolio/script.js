document.addEventListener('DOMContentLoaded', () => {
  // Hamburger-valikon toiminnallisuus
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
  });

  // Modal-toiminnallisuus portfolion projekteille
  const projects = document.querySelectorAll('.project');
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalClose = document.getElementById('modal-close');

  projects.forEach(project => {
    project.addEventListener('click', () => {
      // Hae projektin data-attribuutit
      const title = project.getAttribute('data-title');
      const description = project.getAttribute('data-description');
      const image = project.getAttribute('data-image');
      
      modalTitle.textContent = title;
      modalDescription.textContent = description;
      modalImage.src = image;
      
      modal.style.display = 'block';
    });
  });

  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Suljetaan modal myös, kun klikataan modalin ulkopuolella
  window.addEventListener('click', (e) => {
    if (e.target == modal) {
      modal.style.display = 'none';
    }
  });
});

  