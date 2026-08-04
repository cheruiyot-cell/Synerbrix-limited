// ============================================================
//  Synerbrix Limited – Main JavaScript
//  All custom functionality in one clean file.
//  Dependencies: jQuery (CDN), GSAP (CDN), ScrollTrigger (CDN)
// ============================================================

(function() {
    'use strict';

    // ---------- PAGE LOADER ----------
    var loader = document.getElementById('pageLoader');
    if (loader) {
        // Hide loader after page fully loads
        window.addEventListener('load', function() {
            setTimeout(function() {
                loader.classList.add('hidden');
            }, 600);
        });
        // Fallback: hide after 3s even if load event is slow
        setTimeout(function() {
            if (!loader.classList.contains('hidden')) {
                loader.classList.add('hidden');
            }
        }, 3000);
    }

    // ---------- GSAP SCROLL ANIMATIONS (premium) ----------
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero title animation
        gsap.from('.hero-title', {
            duration: 1.2,
            y: 60,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.3
        });

        gsap.from('.hero-subtitle', {
            duration: 1.0,
            y: 40,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.6
        });

        gsap.from('.hero-buttons', {
            duration: 0.9,
            y: 30,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.9
        });

        gsap.from('.hero-graphic', {
            duration: 1.4,
            x: 60,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.5
        });

        // Service cards staggered reveal
        gsap.utils.toArray('.service-card').forEach(function(card, i) {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                },
                duration: 0.8,
                y: 50,
                opacity: 0,
                ease: 'power2.out',
                delay: i * 0.1
            });
        });

        // Audience cards staggered
        gsap.utils.toArray('.audience-card').forEach(function(card, i) {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                },
                duration: 0.7,
                y: 40,
                opacity: 0,
                ease: 'power2.out',
                delay: i * 0.08
            });
        });

        // Process steps staggered
        gsap.utils.toArray('.step-card').forEach(function(card, i) {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                },
                duration: 0.7,
                y: 40,
                opacity: 0,
                ease: 'power2.out',
                delay: i * 0.08
            });
        });

        // About stats
        gsap.utils.toArray('.stat-card').forEach(function(card, i) {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                duration: 0.8,
                scale: 0.92,
                opacity: 0,
                ease: 'power2.out',
                delay: i * 0.1
            });
        });

        // Problem/Solution boxes
        gsap.from('.ps-box', {
            scrollTrigger: {
                trigger: '.ps-grid',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            duration: 0.9,
            y: 40,
            opacity: 0,
            ease: 'power2.out',
            stagger: 0.15
        });
    }

    // ---------- MOBILE TOGGLE ----------
    var toggleBtn = document.getElementById('mobile-toggle');
    var navMenu = document.getElementById('nav-menu');

    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            var icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.className = navMenu.classList.contains('active') ?
                    'fa-solid fa-xmark' :
                    'fa-solid fa-bars';
            }
        });

        navMenu.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                var icon = toggleBtn.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });

        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                var icon = toggleBtn.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // ---------- ACTIVE NAV LINK ----------
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        var scrollPos = window.scrollY + 120;
        var currentId = '';
        sections.forEach(function(section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentId = section.getAttribute('id');
            }
        });
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentId) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('load', updateActiveLink);

    // ---------- FORM VALIDATION ----------
    var form = document.getElementById('quote-form');
    var successEl = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var valid = true;

            // Clear previous errors
            form.querySelectorAll('.error-msg').forEach(function(el) {
                el.classList.remove('visible');
            });
            form.querySelectorAll('.form-input').forEach(function(el) {
                el.classList.remove('error');
            });

            var name = document.getElementById('fullName');
            if (!name.value.trim()) {
                name.classList.add('error');
                document.getElementById('nameError').classList.add('visible');
                valid = false;
            }

            var phone = document.getElementById('phone');
            var phoneVal = phone.value.trim();
            if (!phoneVal || !/^[0-9+\-\s]{8,15}$/.test(phoneVal)) {
                phone.classList.add('error');
                document.getElementById('phoneError').classList.add('visible');
                valid = false;
            }

            var service = document.getElementById('service');
            if (!service.value) {
                service.classList.add('error');
                document.getElementById('serviceError').classList.add('visible');
                valid = false;
            }

            var message = document.getElementById('message');
            if (!message.value.trim()) {
                message.classList.add('error');
                document.getElementById('messageError').classList.add('visible');
                valid = false;
            }

            if (valid) {
                if (successEl) {
                    successEl.style.display = 'block';
                    form.reset();
                    // Premium success animation (if GSAP available)
                    if (typeof gsap !== 'undefined') {
                        gsap.from(successEl, {
                            duration: 0.6,
                            scale: 0.95,
                            opacity: 0,
                            ease: 'power2.out'
                        });
                    }
                    // Auto-hide success message after 7 seconds
                    setTimeout(function() {
                        if (successEl) {
                            if (typeof gsap !== 'undefined') {
                                gsap.to(successEl, {
                                    duration: 0.5,
                                    opacity: 0,
                                    ease: 'power2.in',
                                    onComplete: function() {
                                        successEl.style.display = 'none';
                                        successEl.style.opacity = 1;
                                    }
                                });
                            } else {
                                successEl.style.display = 'none';
                            }
                        }
                    }, 7000);
                }
                console.log('Quote request sent:', {
                    name: name.value.trim(),
                    phone: phone.value.trim(),
                    service: service.value,
                    message: message.value.trim()
                });
            }
        });
    }

    // ---------- SMOOTH SCROLL FOR ANCHORS ----------
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();