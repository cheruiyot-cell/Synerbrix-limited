// ===== SYNERBRIX LIMITED =====
document.addEventListener('DOMContentLoaded', function() {
  // ===== MOBILE NAVIGATION TOGGLE =====
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function() {
      navMenu.classList.toggle('open');
      
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
  
  // ===== SMOOTH SCROLL =====
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
  
  // ===== ACTIVE NAV LINK =====
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
  updateActiveNavLink();
  
  // ===== WHATSAPP BOOKING FORM =====
  const quoteForm = document.getElementById('quote-form');
  const formSuccess = document.getElementById('formSuccess');
  const WHATSAPP_NUMBER = '254732832849';
  
  if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Reset errors
      const errorMessages = document.querySelectorAll('.error-msg');
      errorMessages.forEach(msg => {
        msg.style.display = 'none';
      });
      
      // Get values
      const fullName = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value.trim();
      
      // Validate
      let isValid = true;
      
      if (!fullName) {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
      }
      
      if (!phone || phone.length < 9) {
        document.getElementById('phoneError').style.display = 'block';
        isValid = false;
      }
      
      if (!service) {
        document.getElementById('serviceError').style.display = 'block';
        isValid = false;
      }
      
      if (!message || message.length < 10) {
        document.getElementById('messageError').style.display = 'block';
        isValid = false;
      }
      
      // If valid, redirect to WhatsApp
      if (isValid) {
        // Show success message briefly
        if (formSuccess) {
          formSuccess.style.display = 'block';
        }
        
        // Get service name
        const serviceSelect = document.getElementById('service');
        const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
        
        // Build WhatsApp message
        const encodedMessage = encodeURIComponent(
          `🔷 *New Service Inquiry - Synerbrix Limited*\n\n` +
          `*Name:* ${fullName}\n` +
          `*Phone:* ${phone}\n` +
          `*Service Required:* ${serviceText}\n` +
          `*Project Details:*\n${message}\n\n` +
          `_Sent from Synerbrix website_`
        );
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        }, 800);
      }
    });
    
    // Real-time validation
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
  
  // ===== ADD WHATSAPP BUTTONS TO SERVICE CARDS =====
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    const serviceTitle = card.querySelector('h3')?.textContent || 'Service';
    const serviceDescription = card.querySelector('p')?.textContent || '';
    
    // Check if button already exists
    if (!card.querySelector('.btn-whatsapp-service')) {
      const whatsappBtn = document.createElement('a');
      whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `🔷 *Service Inquiry: ${serviceTitle}*\n\n` +
        `I'm interested in your ${serviceTitle} service.\n` +
        `Please provide more details and a quote.\n\n` +
        `_From Synerbrix website_`
      )}`;
      whatsappBtn.target = '_blank';
      whatsappBtn.className = 'btn btn-whatsapp btn-whatsapp-service';
      whatsappBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Book via WhatsApp';
      card.appendChild(whatsappBtn);
    }
  });
  
  // ===== FAQ ACCORDION =====
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  
  faqItems.forEach(item => {
    const summary = item.querySelector('.faq-summary');
    if (summary) {
      summary.addEventListener('click', function(e) {
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
  
  // ===== SCROLL ANIMATIONS =====
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(element => {
    element.style.opacity = '1';
    element.style.transform = 'none';
    element.style.visibility = 'visible';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  // ===== STATS ANIMATION =====
  const statItems = document.querySelectorAll('.stat-item h3');
  function animateStats() {
    statItems.forEach(stat => {
      const text = stat.textContent;
      const hasNumber = /\d/.test(text);
      if (hasNumber) {
        stat.style.transition = 'color 0.5s ease';
        stat.style.color = '#38bdf8';
      }
    });
  }
  animateStats();
  
  console.log('✅ Synerbrix Limited - WhatsApp booking enabled');
  console.log('📞 WhatsApp: +254 732 832 849');
  console.log('💳 M-Pesa PayBill: 400200 (Acc: 0714202996)');
});