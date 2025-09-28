
// src/app/theme.ts

const THEME_STORAGE_KEY = 'bsix-theme-preference';

export type Theme = 'bbc' | 'nothing';

/**
 * 現在のテーマを取得します。
 * localStorageに保存されている値を優先し、なければ'bbc'を返します。
 */
export function getCurrentTheme(): Theme {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === 'nothing' ? 'nothing' : 'bbc';
}

/**
 * 指定されたテーマを適用し、localStorageに保存します。
 * @param theme 適用するテーマ ('bbc' または 'nothing')
 */
export function applyTheme(theme: Theme): void {
    const body = document.body;
    body.classList.remove('bbc-theme', 'nothing-theme');
    body.classList.add(theme === 'nothing' ? 'nothing-theme' : 'bbc-theme');
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    console.log(`Theme applied: ${theme}`);
}

/**
 * テーマ切り替えボタンを初期化します。
 */
export function initializeThemeSwitcher(): void {
    const switcherContainer = document.createElement('div');
    switcherContainer.id = 'theme-switcher';
    switcherContainer.style.position = 'fixed';
    switcherContainer.style.top = '20px';
    switcherContainer.style.right = '20px';
    switcherContainer.style.zIndex = '9999';

    const button = document.createElement('button');
    button.id = 'theme-toggle-btn';
    
    const updateButtonText = (theme: Theme) => {
        button.textContent = theme === 'bbc' ? 'Switch to NOTHING' : 'Switch to BBC Sport';
    };

    button.addEventListener('click', () => {
        const newTheme = getCurrentTheme() === 'bbc' ? 'nothing' : 'bbc';
        applyTheme(newTheme);
        updateButtonText(newTheme);
    });

    // 初期状態の設定
    const initialTheme = getCurrentTheme();
    applyTheme(initialTheme);
    updateButtonText(initialTheme);

    switcherContainer.appendChild(button);
    document.body.appendChild(switcherContainer);
    
    console.log('Theme switcher initialized.');
}

