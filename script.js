// ===== SYNERBRIX LIMITED - MAIN JAVASCRIPT =====
document.addEventListener('DOMContentLoaded', function() {
  // ===== MOBILE NAVIGATION TOGGLE =====
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function() {
      navMenu.classList.toggle('open');
      
      // Toggle icon between bars and X
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!navMenu.contains(event.target) && !mobileToggle.contains(event.target)) {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });
    
    // Close menu when clicking a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }
  
  // ===== SMOOTH SCROLL FOR NAV LINKS (enhanced) =====
  const allNavLinks = document.querySelectorAll('a[href^="#"]');
  allNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // ===== ACTIVE NAV LINK HIGHLIGHTING =====
  const sections = document.querySelectorAll('section[id]');
  const navLinkItems = document.querySelectorAll('.nav-link');
  
  function updateActiveNavLink() {
    let current = '';
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinkItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // Call once on load
  
  // ===== QUOTE FORM VALIDATION =====
  const quoteForm = document.getElementById('quote-form');
  const formSuccess = document.getElementById('formSuccess');
  
  if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Reset error messages
      const errorMessages = document.querySelectorAll('.error-msg');
      errorMessages.forEach(msg => {
        msg.style.display = 'none';
      });
      
      // Get form values
      const fullName = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value.trim();
      
      // Validation flags
      let isValid = true;
      
      // Validate name
      if (!fullName) {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
      }
      
      // Validate phone (basic check)
      if (!phone || phone.length < 9) {
        document.getElementById('phoneError').style.display = 'block';
        isValid = false;
      }
      
      // Validate service selection
      if (!service) {
        document.getElementById('serviceError').style.display = 'block';
        isValid = false;
      }
      
      // Validate message
      if (!message || message.length < 10) {
        document.getElementById('messageError').style.display = 'block';
        isValid = false;
      }
      
      // If all valid, show success message
      if (isValid) {
        // Here you would typically send data to a server
        // For demo purposes, we'll show success message
        quoteForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.style.display = 'block';
        }
        
        // Optional: Scroll to success message
        if (formSuccess) {
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Reset form after 5 seconds (optional)
        setTimeout(() => {
          quoteForm.style.display = 'block';
          if (formSuccess) {
            formSuccess.style.display = 'none';
          }
          quoteForm.reset();
        }, 5000);
      }
    });
    
    // Real-time validation on input
    const inputs = quoteForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        const errorId = this.id + 'Error';
        const errorElement = document.getElementById(errorId);
        if (errorElement && this.value.trim()) {
          errorElement.style.display = 'none';
        }
      });
    });
  }
  
  // ===== FAQ ACCORDION ENHANCEMENT =====
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  
  faqItems.forEach(item => {
    const summary = item.querySelector('.faq-summary');
    if (summary) {
      summary.addEventListener('click', function(e) {
        // Close other open items (optional)
        if (!item.hasAttribute('open')) {
          faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.hasAttribute('open')) {
              otherItem.removeAttribute('open');
            }
          });
        }
      });
    }
  });
  
  // ===== SCROLL ANIMATIONS (simple fade-in) =====
  const revealElements = document.querySelectorAll('.reveal');
  
  // Since we have a fallback that forces visibility, 
  // we'll add a subtle animation using CSS transitions
  revealElements.forEach(element => {
    element.style.opacity = '1';
    element.style.transform = 'none';
    element.style.visibility = 'visible';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  // ===== STATS COUNTER ANIMATION (optional enhancement) =====
  const statItems = document.querySelectorAll('.stat-item h3');
  
  function animateStats() {
    statItems.forEach(stat => {
      const text = stat.textContent;
      const hasNumber = /\d/.test(text);
      
      if (hasNumber) {
        // Simple animation - just add a highlight effect
        stat.style.transition = 'color 0.5s ease';
        stat.style.color = '#38bdf8';
      }
    });
  }
  
  // Call once on load
  animateStats();
  
  // ===== CONSOLE LOG (for debugging) =====
  console.log('✅ Synerbrix Limited - Premium website loaded successfully');
  console.log('📞 Support: 0732 832 849');
  console.log('💳 M-Pesa PayBill: 400200');
});