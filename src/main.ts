/**
 * Main application entry point
 * Initializes the BSix.com application
 */

import { teamsManager } from '@/features/teams';
import { playersManager } from '@/features/players';
import { matchesManager } from '@/features/matches';
import { dataManager, DataSourceFactory } from '@/datasource';
import { DOMUtils } from '@/utils';

class BSixApp {
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) {
      console.warn('App already initialized');
      return;
    }

    try {
      console.log('Initializing BSix.com application...');
      
      // Register data sources
      this.registerDataSources();
      
      // Load initial data
      await this.loadInitialData();
      
      // Initialize UI components
      this.initializeUI();
      
      // Set up event listeners
      this.setupEventListeners();
      
      this.initialized = true;
      console.log('BSix.com application initialized successfully');
      
      // Dispatch custom event for other scripts
      window.dispatchEvent(new CustomEvent('bsix:initialized'));
      
    } catch (error) {
      console.error('Failed to initialize application:', error);
      this.showErrorMessage('Failed to load application. Please refresh the page.');
    }
  }

  private registerDataSources(): void {
    // Register team data source
    const teamsSource = DataSourceFactory.createTeamsDataSource('/data/versions/2025-09-20_gw4_accurate_premier_league_table.json');
    dataManager.registerSource('teams', teamsSource);

    // Register match data source
    const matchesSource = DataSourceFactory.createMatchesDataSource('/data/current-schedule.json');
    dataManager.registerSource('matches', matchesSource);

    // Register player data source
    const playersSource = DataSourceFactory.createPlayersDataSource('/data/versions/2024-09-20_team_detailed_stats.json');
    dataManager.registerSource('players', playersSource);
  }

  private async loadInitialData(): Promise<void> {
    try {
      // Load teams data
      const teamsData = await dataManager.loadData('teams');
      if (Array.isArray(teamsData)) {
        teamsData.forEach(team => teamsManager.addTeam(team));
      }

      // Load matches data
      try {
        const matchesData = await dataManager.loadData('matches');
        if (Array.isArray(matchesData)) {
          matchesData.forEach(match => matchesManager.addMatch(match));
        }
      } catch (error) {
        console.warn('Failed to load matches data:', error);
      }

      // Load players data
      try {
        const playersData = await dataManager.loadData('players');
        if (Array.isArray(playersData)) {
          playersData.forEach(player => playersManager.addPlayer(player));
        }
      } catch (error) {
        console.warn('Failed to load players data:', error);
      }

    } catch (error) {
      console.error('Failed to load initial data:', error);
      throw error;
    }
  }

  private initializeUI(): void {
    // Initialize theme
    this.initializeTheme();
    
    // Initialize navigation
    this.initializeNavigation();
    
    // Initialize responsive features
    this.initializeResponsive();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('bsix-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Theme toggle functionality
    const themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('bsix-theme', newTheme);
      });
    }
  }

  private initializeNavigation(): void {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    
    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', 
          mobileMenu.classList.contains('active').toString()
        );
      });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileMenu && !mobileMenu.contains(e.target as Node) && 
          !mobileMenuToggle?.contains(e.target as Node)) {
        mobileMenu.classList.remove('active');
        mobileMenuToggle?.setAttribute('aria-expanded', 'false');
      }
    });
  }

  private initializeResponsive(): void {
    // Handle responsive table scrolling
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      const wrapper = DOMUtils.createElement('div', {
        className: 'table-wrapper'
      });
      
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    // Handle responsive images
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  private setupEventListeners(): void {
    // Handle form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      if (form.hasAttribute('data-ajax')) {
        e.preventDefault();
        this.handleAjaxForm(form);
      }
    });

    // Handle external links
    document.addEventListener('click', (e) => {
      const link = e.target as HTMLAnchorElement;
      if (link.tagName === 'A' && link.hostname !== window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close any open modals or dropdowns
        const openModals = document.querySelectorAll('.modal-overlay');
        openModals.forEach(modal => {
          const closeButton = modal.querySelector('.modal__close') as HTMLButtonElement;
          closeButton?.click();
        });
      }
    });
  }

  private async handleAjaxForm(form: HTMLFormElement): Promise<void> {
    const formData = new FormData(form);
    const submitButton = form.querySelector('[type="submit"]') as HTMLButtonElement;
    
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Loading...';
    }

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData
      });

      if (response.ok) {
        this.showSuccessMessage('Form submitted successfully!');
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showErrorMessage('Failed to submit form. Please try again.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
      }
    }
  }

  private showErrorMessage(message: string): void {
    this.showMessage(message, 'error');
  }

  private showSuccessMessage(message: string): void {
    this.showMessage(message, 'success');
  }

  private showMessage(message: string, type: 'error' | 'success' | 'info' = 'info'): void {
    const notification = DOMUtils.createElement('div', {
      className: `notification notification--${type}`,
      textContent: message
    });

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);

    // Allow manual dismissal
    notification.addEventListener('click', () => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    });
  }

  // Public API methods
  getTeamsManager() {
    return teamsManager;
  }

  getPlayersManager() {
    return playersManager;
  }

  getMatchesManager() {
    return matchesManager;
  }

  getDataManager() {
    return dataManager;
  }
}

// Create global app instance
const app = new BSixApp();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Export for use in other scripts
(window as any).BSixApp = app;

export default app;
