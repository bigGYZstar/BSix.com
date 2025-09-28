/**
 * NOTHING Style Controller for BSix.com
 * Handles NOTHING design system interactions and animations
 */

class NothingStyleController {
  constructor() {
    this.isNothingTheme = false;
    this.animationQueue = [];
    this.floatingElements = [];
    this.init();
  }

  /**
   * Initialize NOTHING style controller
   */
  init() {
    this.setupEventListeners();
    this.initializeFloatingElements();
    this.setupIntersectionObserver();
    this.loadUserPreference();
  }

  /**
   * Setup event listeners for NOTHING interactions
   */
  setupEventListeners() {
    // Card hover effects
    document.addEventListener('mouseover', (e) => {
      if (e.target.classList.contains('nothing-card')) {
        this.handleCardHover(e.target);
      }
    });

    // Card click effects
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('nothing-card')) {
        this.handleCardClick(e.target);
      }
    });

    // Navigation interactions
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('nothing-nav-item')) {
        this.handleNavClick(e.target);
      }
    });

    // Window resize handler
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  /**
   * Handle card hover effects
   */
  handleCardHover(card) {
    // Add ripple effect
    this.createRippleEffect(card);
    
    // Enhance glow effect
    const glowColor = this.getCardGlowColor(card);
    card.style.setProperty('--dynamic-glow', `0 0 30px ${glowColor}`);
    
    // Animate neighboring cards
    this.animateNeighboringCards(card);
  }

  /**
   * Handle card click effects
   */
  handleCardClick(card) {
    // Scale animation
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
      card.style.transform = '';
    }, 150);

    // Create click wave effect
    this.createClickWave(card);
  }

  /**
   * Handle navigation click effects
   */
  handleNavClick(navItem) {
    // Add active state animation
    navItem.classList.add('nothing-nav-active');
    setTimeout(() => {
      navItem.classList.remove('nothing-nav-active');
    }, 300);
  }

  /**
   * Create ripple effect on card hover
   */
  createRippleEffect(card) {
    const ripple = document.createElement('div');
    ripple.className = 'nothing-ripple';
    ripple.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: nothing-ripple-expand 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;

    card.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /**
   * Create click wave effect
   */
  createClickWave(card) {
    const wave = document.createElement('div');
    wave.className = 'nothing-click-wave';
    wave.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
      border-radius: inherit;
      animation: nothing-wave-sweep 0.4s ease-out;
      pointer-events: none;
      z-index: 2;
    `;

    card.appendChild(wave);
    
    setTimeout(() => {
      wave.remove();
    }, 400);
  }

  /**
   * Get card glow color based on card type
   */
  getCardGlowColor(card) {
    if (card.classList.contains('nothing-card--pink')) return 'rgba(255, 0, 110, 0.5)';
    if (card.classList.contains('nothing-card--cyan')) return 'rgba(0, 255, 255, 0.5)';
    if (card.classList.contains('nothing-card--orange')) return 'rgba(255, 102, 0, 0.5)';
    if (card.classList.contains('nothing-card--green')) return 'rgba(0, 255, 0, 0.5)';
    if (card.classList.contains('nothing-card--blue')) return 'rgba(0, 102, 255, 0.5)';
    if (card.classList.contains('nothing-card--liverpool')) return 'rgba(200, 16, 46, 0.5)';
    if (card.classList.contains('nothing-card--arsenal')) return 'rgba(239, 1, 7, 0.5)';
    if (card.classList.contains('nothing-card--chelsea')) return 'rgba(3, 70, 148, 0.5)';
    return 'rgba(255, 255, 255, 0.3)';
  }

  /**
   * Animate neighboring cards on hover
   */
  animateNeighboringCards(hoveredCard) {
    const allCards = document.querySelectorAll('.nothing-card');
    const hoveredRect = hoveredCard.getBoundingClientRect();
    
    allCards.forEach(card => {
      if (card === hoveredCard) return;
      
      const cardRect = card.getBoundingClientRect();
      const distance = this.calculateDistance(hoveredRect, cardRect);
      
      if (distance < 300) {
        const intensity = Math.max(0, 1 - distance / 300);
        card.style.transform = `scale(${1 + intensity * 0.05})`;
        card.style.opacity = `${0.7 + intensity * 0.3}`;
      }
    });
  }

  /**
   * Calculate distance between two rectangles
   */
  calculateDistance(rect1, rect2) {
    const dx = (rect1.left + rect1.width / 2) - (rect2.left + rect2.width / 2);
    const dy = (rect1.top + rect1.height / 2) - (rect2.top + rect2.height / 2);
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Initialize floating elements animation
   */
  initializeFloatingElements() {
    const floatingElements = document.querySelectorAll('.nothing-floating-stats');
    
    floatingElements.forEach((element, index) => {
      // Add random floating animation delay
      const delay = index * 0.5;
      element.style.animationDelay = `${delay}s`;
      element.classList.add('nothing-animate-float');
      
      // Store reference for later use
      this.floatingElements.push({
        element,
        originalPosition: element.getBoundingClientRect()
      });
    });
  }

  /**
   * Setup intersection observer for scroll animations
   */
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('nothing-animate-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    // Observe all NOTHING cards
    document.querySelectorAll('.nothing-card').forEach(card => {
      observer.observe(card);
    });
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Recalculate floating element positions
    this.floatingElements.forEach(item => {
      const newRect = item.element.getBoundingClientRect();
      item.originalPosition = newRect;
    });
  }

  /**
   * Toggle between BBC and NOTHING themes
   */
  toggleTheme() {
    const body = document.body;
    
    if (this.isNothingTheme) {
      // Switch to BBC theme
      body.classList.remove('nothing-theme');
      body.classList.add('bbc-theme');
      this.isNothingTheme = false;
    } else {
      // Switch to NOTHING theme
      body.classList.remove('bbc-theme');
      body.classList.add('nothing-theme');
      this.isNothingTheme = true;
    }
    
    // Save user preference
    localStorage.setItem('bsix-theme', this.isNothingTheme ? 'nothing' : 'bbc');
    
    // Trigger theme change event
    this.dispatchThemeChangeEvent();
  }

  /**
   * Load user theme preference
   */
  loadUserPreference() {
    const savedTheme = localStorage.getItem('bsix-theme');
    
    if (savedTheme === 'nothing') {
      document.body.classList.add('nothing-theme');
      this.isNothingTheme = true;
    } else {
      document.body.classList.add('bbc-theme');
      this.isNothingTheme = false;
    }
  }

  /**
   * Dispatch theme change event
   */
  dispatchThemeChangeEvent() {
    const event = new CustomEvent('themeChanged', {
      detail: {
        theme: this.isNothingTheme ? 'nothing' : 'bbc',
        timestamp: Date.now()
      }
    });
    
    document.dispatchEvent(event);
  }

  /**
   * Add dynamic CSS animations
   */
  addDynamicAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes nothing-ripple-expand {
        0% { width: 0; height: 0; opacity: 1; }
        100% { width: 200px; height: 200px; opacity: 0; }
      }
      
      @keyframes nothing-wave-sweep {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes nothing-animate-in {
        0% { opacity: 0; transform: translateY(30px) scale(0.9); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      
      .nothing-animate-in {
        animation: nothing-animate-in 0.6s ease-out forwards;
      }
      
      .nothing-nav-active {
        transform: scale(1.1) !important;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.5) !important;
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Initialize particle system for background
   */
  initParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.className = 'nothing-particles';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.3;
    `;
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    
    // Animate particles
    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animateParticles);
    };
    
    animateParticles();
  }
}

// Initialize NOTHING Style Controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.nothingController = new NothingStyleController();
  window.nothingController.addDynamicAnimations();
  
  // Initialize particle system only for NOTHING theme
  if (document.body.classList.contains('nothing-theme')) {
    window.nothingController.initParticleSystem();
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NothingStyleController;
}
