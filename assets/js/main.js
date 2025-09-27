// Main JavaScript for Oliver White Portfolio
// Professional, accessible, and performance-focused interactions

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initSmoothScrolling();
        initFormHandling();
        initAccessibility();
        initPerformanceOptimizations();
    });
    
    /**
     * Initialize navigation functionality
     */
    function initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!navToggle || !navMenu) return;
        
        // Mobile menu toggle
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Update hamburger animation
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
        
        // Handle submenu interactions
        const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
        dropdownToggles.forEach(function(toggle) {
            toggle.addEventListener('click', function() {
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
                
                // Rotate arrow
                const arrow = toggle.querySelector('.dropdown-arrow');
                if (arrow) {
                    arrow.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
                }
            });
        });
        
        // Close submenus on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                dropdownToggles.forEach(function(toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                    const arrow = toggle.querySelector('.dropdown-arrow');
                    if (arrow) arrow.style.transform = 'rotate(0deg)';
                });
            }
        });
    }
    
    /**
     * Initialize smooth scrolling for anchor links
     */
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                
                e.preventDefault();
                
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.site-header').offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update focus for accessibility
                targetElement.focus();
            });
        });
    }
    
    /**
     * Initialize form handling with validation and feedback
     */
    function initFormHandling() {
        const forms = document.querySelectorAll('form[data-netlify]');
        
        forms.forEach(function(form) {
            form.addEventListener('submit', function(e) {
                if (!validateForm(form)) {
                    e.preventDefault();
                    return;
                }
                
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Sending...';
                    submitBtn.disabled = true;
                    
                    // Reset button after timeout (in case of issues)
                    setTimeout(function() {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 10000);
                }
            });
        });
    }
    
    /**
     * Basic form validation
     */
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(function(field) {
            const value = field.value.trim();
            const fieldContainer = field.closest('.form-group');
            
            // Remove existing error states
            field.classList.remove('error');
            const existingError = fieldContainer?.querySelector('.error-message');
            if (existingError) existingError.remove();
            
            // Validate field
            if (!value) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else if (field.type === 'email' && !isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    /**
     * Show field error message
     */
    function showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        
        const fieldContainer = field.closest('.form-group');
        if (fieldContainer) {
            fieldContainer.appendChild(errorElement);
        }
        
        // Focus on first error field
        if (!document.querySelector('.error:focus')) {
            field.focus();
        }
    }
    
    /**
     * Basic email validation
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Initialize accessibility enhancements
     */
    function initAccessibility() {
        // Add skip link functionality
        const skipLink = document.querySelector('.skip-link');
        const mainContent = document.querySelector('#main-content');
        
        if (skipLink && mainContent) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        // Improve focus management for dropdowns
        const dropdowns = document.querySelectorAll('.has-submenu');
        dropdowns.forEach(function(dropdown) {
            const toggle = dropdown.querySelector('.nav-dropdown-toggle');
            const menu = dropdown.querySelector('.nav-submenu');
            
            if (!toggle || !menu) return;
            
            // Handle keyboard navigation
            toggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle.click();
                }
            });
            
            // Focus management for submenu items
            const menuItems = menu.querySelectorAll('a');
            menuItems.forEach(function(item, index) {
                item.addEventListener('keydown', function(e) {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const nextItem = menuItems[index + 1] || menuItems[0];
                        nextItem.focus();
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prevItem = menuItems[index - 1] || menuItems[menuItems.length - 1];
                        prevItem.focus();
                    } else if (e.key === 'Escape') {
                        toggle.click();
                        toggle.focus();
                    }
                });
            });
        });
    }
    
    /**
     * Initialize performance optimizations
     */
    function initPerformanceOptimizations() {
        // Lazy load images with intersection observer
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(function(img) {
                imageObserver.observe(img);
            });
        }
        
        // Optimize animations based on user preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-fast', '0s');
            document.documentElement.style.setProperty('--transition-normal', '0s');
            document.documentElement.style.setProperty('--transition-slow', '0s');
        }
        
        // Add loading states for slow networks
        if ('connection' in navigator && navigator.connection.effectiveType === 'slow-2g') {
            document.body.classList.add('slow-connection');
        }
    }
    
    /**
     * Utility function to debounce events
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = function() {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Handle scroll events for performance
     */
    const handleScroll = debounce(function() {
        // Add any scroll-based functionality here
        // Currently kept minimal for performance
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    /**
     * Handle window resize events
     */
    const handleResize = debounce(function() {
        // Close mobile menu on resize to larger screen
        if (window.innerWidth > 768) {
            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.querySelector('.nav-toggle');
            
            if (navMenu && navToggle) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        }
    }, 250);
    
    window.addEventListener('resize', handleResize, { passive: true });
    
})();
