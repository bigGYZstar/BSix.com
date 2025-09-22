/**
 * Shared UI Components
 * Reusable components across the application
 */

export interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
}

export class Button {
  private element: HTMLButtonElement;

  constructor(props: ButtonProps) {
    this.element = document.createElement('button');
    this.element.textContent = props.text;
    this.element.className = this.getButtonClasses(props);
    this.element.disabled = props.disabled || false;
    
    if (props.onClick) {
      this.element.addEventListener('click', props.onClick);
    }
  }

  private getButtonClasses(props: ButtonProps): string {
    const baseClass = 'btn';
    const variantClass = `btn--${props.variant || 'primary'}`;
    const sizeClass = `btn--${props.size || 'medium'}`;
    
    return `${baseClass} ${variantClass} ${sizeClass}`;
  }

  getElement(): HTMLButtonElement {
    return this.element;
  }

  updateText(text: string): void {
    this.element.textContent = text;
  }

  setDisabled(disabled: boolean): void {
    this.element.disabled = disabled;
  }
}

export interface CardProps {
  title?: string;
  content: string;
  variant?: 'default' | 'team' | 'stats';
  onClick?: () => void;
}

export class Card {
  private element: HTMLDivElement;

  constructor(props: CardProps) {
    this.element = document.createElement('div');
    this.element.className = this.getCardClasses(props);
    
    if (props.title) {
      const titleElement = document.createElement('h3');
      titleElement.textContent = props.title;
      titleElement.className = 'card__title';
      this.element.appendChild(titleElement);
    }

    const contentElement = document.createElement('div');
    contentElement.innerHTML = props.content;
    contentElement.className = 'card__content';
    this.element.appendChild(contentElement);

    if (props.onClick) {
      this.element.addEventListener('click', props.onClick);
      this.element.style.cursor = 'pointer';
    }
  }

  private getCardClasses(props: CardProps): string {
    const baseClass = 'card';
    const variantClass = `card--${props.variant || 'default'}`;
    
    return `${baseClass} ${variantClass}`;
  }

  getElement(): HTMLDivElement {
    return this.element;
  }

  updateContent(content: string): void {
    const contentElement = this.element.querySelector('.card__content');
    if (contentElement) {
      contentElement.innerHTML = content;
    }
  }
}

export interface ModalProps {
  title: string;
  content: string;
  onClose?: () => void;
}

export class Modal {
  private overlay: HTMLDivElement;
  private modal: HTMLDivElement;

  constructor(props: ModalProps) {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    
    this.modal = document.createElement('div');
    this.modal.className = 'modal';
    
    const header = document.createElement('div');
    header.className = 'modal__header';
    
    const title = document.createElement('h2');
    title.textContent = props.title;
    title.className = 'modal__title';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.className = 'modal__close';
    closeButton.addEventListener('click', () => this.close());
    
    header.appendChild(title);
    header.appendChild(closeButton);
    
    const content = document.createElement('div');
    content.innerHTML = props.content;
    content.className = 'modal__content';
    
    this.modal.appendChild(header);
    this.modal.appendChild(content);
    this.overlay.appendChild(this.modal);
    
    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });

    if (props.onClose) {
      this.onClose = props.onClose;
    }
  }

  private onClose?: () => void;

  show(): void {
    document.body.appendChild(this.overlay);
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    const firstFocusable = this.modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  close(): void {
    if (this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    document.body.style.overflow = '';
    
    if (this.onClose) {
      this.onClose();
    }
  }

  updateContent(content: string): void {
    const contentElement = this.modal.querySelector('.modal__content');
    if (contentElement) {
      contentElement.innerHTML = content;
    }
  }
}

export interface TabsProps {
  tabs: Array<{
    id: string;
    label: string;
    content: string;
  }>;
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
}

export class Tabs {
  private container: HTMLDivElement;
  private tabsNav: HTMLDivElement;
  private tabsContent: HTMLDivElement;
  private activeTab: string;

  constructor(props: TabsProps) {
    this.container = document.createElement('div');
    this.container.className = 'tabs';
    
    this.tabsNav = document.createElement('div');
    this.tabsNav.className = 'tabs__nav';
    
    this.tabsContent = document.createElement('div');
    this.tabsContent.className = 'tabs__content';
    
    this.activeTab = props.defaultTab || props.tabs[0]?.id || '';
    
    this.renderTabs(props.tabs);
    this.renderContent(props.tabs);
    
    this.container.appendChild(this.tabsNav);
    this.container.appendChild(this.tabsContent);
    
    if (props.onTabChange) {
      this.onTabChange = props.onTabChange;
    }
  }

  private onTabChange?: (tabId: string) => void;

  private renderTabs(tabs: TabsProps['tabs']): void {
    tabs.forEach(tab => {
      const button = document.createElement('button');
      button.textContent = tab.label;
      button.className = `tabs__tab ${tab.id === this.activeTab ? 'tabs__tab--active' : ''}`;
      button.addEventListener('click', () => this.switchTab(tab.id));
      this.tabsNav.appendChild(button);
    });
  }

  private renderContent(tabs: TabsProps['tabs']): void {
    tabs.forEach(tab => {
      const panel = document.createElement('div');
      panel.innerHTML = tab.content;
      panel.className = `tabs__panel ${tab.id === this.activeTab ? 'tabs__panel--active' : ''}`;
      panel.id = `panel-${tab.id}`;
      this.tabsContent.appendChild(panel);
    });
  }

  private switchTab(tabId: string): void {
    if (tabId === this.activeTab) return;
    
    // Update nav
    const currentActiveTab = this.tabsNav.querySelector('.tabs__tab--active');
    const newActiveTab = this.tabsNav.querySelector(`[data-tab="${tabId}"]`) || 
                        Array.from(this.tabsNav.children).find(child => 
                          child.textContent === this.getTabLabel(tabId));
    
    if (currentActiveTab) {
      currentActiveTab.classList.remove('tabs__tab--active');
    }
    if (newActiveTab) {
      newActiveTab.classList.add('tabs__tab--active');
    }
    
    // Update content
    const currentActivePanel = this.tabsContent.querySelector('.tabs__panel--active');
    const newActivePanel = this.tabsContent.querySelector(`#panel-${tabId}`);
    
    if (currentActivePanel) {
      currentActivePanel.classList.remove('tabs__panel--active');
    }
    if (newActivePanel) {
      newActivePanel.classList.add('tabs__panel--active');
    }
    
    this.activeTab = tabId;
    
    if (this.onTabChange) {
      this.onTabChange(tabId);
    }
  }

  private getTabLabel(tabId: string): string {
    // This would need to be improved to properly map tab IDs to labels
    return tabId;
  }

  getElement(): HTMLDivElement {
    return this.container;
  }

  getActiveTab(): string {
    return this.activeTab;
  }
}
