#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class DesignManager {
    constructor() {
        this.designSystemPath = './design-system.json';
        this.designSystem = this.loadDesignSystem();
        this.cssOutputPath = './assets/styles/design-system-generated.css';
    }

    loadDesignSystem() {
        try {
            const designData = fs.readFileSync(this.designSystemPath, 'utf8');
            return JSON.parse(designData);
        } catch (error) {
            console.error('デザインシステムファイルの読み込みに失敗しました:', error.message);
            process.exit(1);
        }
    }

    saveDesignSystem() {
        try {
            fs.writeFileSync(this.designSystemPath, JSON.stringify(this.designSystem, null, 2));
            console.log('✅ デザインシステムファイルを更新しました');
        } catch (error) {
            console.error('デザインシステムファイルの保存に失敗しました:', error.message);
        }
    }

    // CSS変数を生成
    generateCSSVariables() {
        let css = ':root {\n';
        
        // カラーパレット
        const colors = this.designSystem.color_palette;
        Object.entries(colors).forEach(([category, colorSet]) => {
            if (typeof colorSet === 'object' && colorSet !== null) {
                Object.entries(colorSet).forEach(([shade, value]) => {
                    if (typeof value === 'string') {
                        css += `  --${category}-${shade}: ${value};\n`;
                    } else if (typeof value === 'object') {
                        Object.entries(value).forEach(([subShade, subValue]) => {
                            css += `  --${category}-${shade}-${subShade}: ${subValue};\n`;
                        });
                    }
                });
            }
        });

        // タイポグラフィ
        const typography = this.designSystem.typography;
        Object.entries(typography).forEach(([category, values]) => {
            Object.entries(values).forEach(([key, value]) => {
                css += `  --${category.replace('_', '-')}-${key.replace('_', '-')}: ${value};\n`;
            });
        });

        // スペーシング
        Object.entries(this.designSystem.spacing).forEach(([key, value]) => {
            css += `  --spacing-${key}: ${value};\n`;
        });

        // ボーダー半径
        Object.entries(this.designSystem.border_radius).forEach(([key, value]) => {
            css += `  --border-radius-${key}: ${value};\n`;
        });

        // シャドウ
        Object.entries(this.designSystem.shadows).forEach(([key, value]) => {
            css += `  --shadow-${key}: ${value};\n`;
        });

        css += '}\n\n';
        return css;
    }

    // コンポーネントCSSを生成
    generateComponentCSS() {
        let css = '';
        const components = this.designSystem.components;

        // ボタンコンポーネント
        if (components.button) {
            Object.entries(components.button).forEach(([variant, styles]) => {
                css += `.btn-${variant} {\n`;
                Object.entries(styles).forEach(([property, value]) => {
                    if (property !== 'hover' && property !== 'transition') {
                        const cssProperty = property.replace(/_/g, '-');
                        css += `  ${cssProperty}: ${value};\n`;
                    }
                });
                if (styles.transition) {
                    css += `  transition: ${styles.transition};\n`;
                }
                css += '}\n\n';

                if (styles.hover) {
                    css += `.btn-${variant}:hover {\n`;
                    Object.entries(styles.hover).forEach(([property, value]) => {
                        const cssProperty = property.replace(/_/g, '-');
                        css += `  ${cssProperty}: ${value};\n`;
                    });
                    css += '}\n\n';
                }
            });
        }

        // カードコンポーネント
        if (components.card) {
            Object.entries(components.card).forEach(([variant, styles]) => {
                css += `.card-${variant} {\n`;
                Object.entries(styles).forEach(([property, value]) => {
                    if (property !== 'hover' && property !== 'transition') {
                        const cssProperty = property.replace(/_/g, '-');
                        css += `  ${cssProperty}: ${value};\n`;
                    }
                });
                if (styles.transition) {
                    css += `  transition: ${styles.transition};\n`;
                }
                css += '}\n\n';

                if (styles.hover) {
                    css += `.card-${variant}:hover {\n`;
                    Object.entries(styles.hover).forEach(([property, value]) => {
                        const cssProperty = property.replace(/_/g, '-');
                        css += `  ${cssProperty}: ${value};\n`;
                    });
                    css += '}\n\n';
                }
            });
        }

        // テーブルコンポーネント
        if (components.table) {
            Object.entries(components.table).forEach(([element, styles]) => {
                if (element === 'default') {
                    css += `.table {\n`;
                } else {
                    css += `.table-${element} {\n`;
                }
                
                Object.entries(styles).forEach(([property, value]) => {
                    if (property !== 'hover' && property !== 'transition') {
                        const cssProperty = property.replace(/_/g, '-');
                        css += `  ${cssProperty}: ${value};\n`;
                    }
                });
                if (styles.transition) {
                    css += `  transition: ${styles.transition};\n`;
                }
                css += '}\n\n';

                if (styles.hover) {
                    if (element === 'default') {
                        css += `.table:hover {\n`;
                    } else {
                        css += `.table-${element}:hover {\n`;
                    }
                    Object.entries(styles.hover).forEach(([property, value]) => {
                        const cssProperty = property.replace(/_/g, '-');
                        css += `  ${cssProperty}: ${value};\n`;
                    });
                    css += '}\n\n';
                }
            });
        }

        // ナビゲーションコンポーネント
        if (components.navigation) {
            Object.entries(components.navigation).forEach(([element, styles]) => {
                css += `.nav-${element} {\n`;
                Object.entries(styles).forEach(([property, value]) => {
                    if (property !== 'hover' && property !== 'active' && property !== 'transition') {
                        const cssProperty = property.replace(/_/g, '-');
                        css += `  ${cssProperty}: ${value};\n`;
                    }
                });
                if (styles.transition) {
                    css += `  transition: ${styles.transition};\n`;
                }
                css += '}\n\n';

                if (styles.hover) {
                    css += `.nav-${element}:hover {\n`;
                    Object.entries(styles.hover).forEach(([property, value]) => {
                        const cssProperty = property.replace(/_/g, '-');
                        css += `  ${cssProperty}: ${value};\n`;
                    });
                    css += '}\n\n';
                }

                if (styles.active) {
                    css += `.nav-${element}.active {\n`;
                    Object.entries(styles.active).forEach(([property, value]) => {
                        const cssProperty = property.replace(/_/g, '-');
                        css += `  ${cssProperty}: ${value};\n`;
                    });
                    css += '}\n\n';
                }
            });
        }

        // フォームコンポーネント
        if (components.form) {
            Object.entries(components.form).forEach(([element, styles]) => {
                css += `.form-${element} {\n`;
                Object.entries(styles).forEach(([property, value]) => {
                    if (property !== 'focus' && property !== 'checked' && property !== 'transition') {
                        const cssProperty = property.replace(/_/g, '-');
                        css += `  ${cssProperty}: ${value};\n`;
                    }
                });
                if (styles.transition) {
                    css += `  transition: ${styles.transition};\n`;
                }
                css += '}\n\n';

                if (styles.focus) {
                    css += `.form-${element}:focus {\n`;
                    Object.entries(styles.focus).forEach(([property, value]) => {
                        const cssProperty = property.replace(/_/g, '-');
                        css += `  ${cssProperty}: ${value};\n`;
                    });
                    css += '}\n\n';
                }

                if (styles.checked) {
                    css += `.form-${element}:checked {\n`;
                    Object.entries(styles.checked).forEach(([property, value]) => {
                        const cssProperty = property.replace(/_/g, '-');
                        css += `  ${cssProperty}: ${value};\n`;
                    });
                    css += '}\n\n';
                }
            });
        }

        // バッジコンポーネント
        if (components.badge) {
            Object.entries(components.badge).forEach(([variant, styles]) => {
                css += `.badge-${variant} {\n`;
                Object.entries(styles).forEach(([property, value]) => {
                    const cssProperty = property.replace(/_/g, '-');
                    css += `  ${cssProperty}: ${value};\n`;
                });
                css += '}\n\n';
            });
        }

        return css;
    }

    // レスポンシブCSSを生成
    generateResponsiveCSS() {
        let css = '';
        const responsive = this.designSystem.responsive;
        const layouts = this.designSystem.layouts;

        // コンテナ
        css += '.container {\n';
        Object.entries(layouts.container).forEach(([property, value]) => {
            const cssProperty = property.replace(/_/g, '-');
            css += `  ${cssProperty}: ${value};\n`;
        });
        css += '}\n\n';

        // グリッド
        css += '.grid {\n';
        css += '  display: grid;\n';
        css += `  gap: ${layouts.grid.gap};\n`;
        css += `  grid-template-columns: ${layouts.grid.columns.mobile};\n`;
        css += '}\n\n';

        // レスポンシブグリッド
        css += `${responsive.media_queries.tablet} {\n`;
        css += '  .grid {\n';
        css += `    grid-template-columns: ${layouts.grid.columns.tablet};\n`;
        css += '  }\n';
        css += '}\n\n';

        css += `${responsive.media_queries.desktop} {\n`;
        css += '  .grid {\n';
        css += `    grid-template-columns: ${layouts.grid.columns.desktop};\n`;
        css += '  }\n';
        css += '}\n\n';

        // セクション
        css += '.section {\n';
        Object.entries(layouts.section).forEach(([property, value]) => {
            const cssProperty = property.replace(/_/g, '-');
            css += `  ${cssProperty}: ${value};\n`;
        });
        css += '}\n\n';

        return css;
    }

    // アニメーションCSSを生成
    generateAnimationCSS() {
        let css = '';
        const animations = this.designSystem.animations;

        Object.entries(animations).forEach(([name, animation]) => {
            if (animation.keyframes) {
                const keyframeName = name.replace(/_/g, '-');
                css += `@keyframes ${keyframeName} {\n`;
                if (animation.from) {
                    css += '  from {\n';
                    Object.entries(animation.from).forEach(([property, value]) => {
                        css += `    ${property}: ${value};\n`;
                    });
                    css += '  }\n';
                }
                if (animation.to) {
                    css += '  to {\n';
                    Object.entries(animation.to).forEach(([property, value]) => {
                        css += `    ${property}: ${value};\n`;
                    });
                    css += '  }\n';
                }
                css += '}\n\n';

                css += `.animate-${keyframeName} {\n`;
                css += `  animation: ${animation.keyframes};\n`;
                css += '}\n\n';
            }
        });

        return css;
    }

    // テーマCSSを生成
    generateThemeCSS() {
        let css = '';
        const themes = this.designSystem.themes;

        Object.entries(themes).forEach(([themeName, theme]) => {
            css += `[data-theme="${themeName}"] {\n`;
            Object.entries(theme).forEach(([property, value]) => {
                const cssProperty = property.replace(/_/g, '-');
                css += `  --theme-${cssProperty}: ${value};\n`;
            });
            css += '}\n\n';
        });

        return css;
    }

    // 完全なCSSファイルを生成
    generateFullCSS() {
        console.log('🎨 デザインシステムからCSSを生成中...');
        
        let fullCSS = '';
        fullCSS += '/* BSix.com Design System - Auto Generated */\n';
        fullCSS += `/* Generated on: ${new Date().toISOString()} */\n`;
        fullCSS += `/* Version: ${this.designSystem.design_system.version} */\n\n`;
        
        fullCSS += '/* CSS Variables */\n';
        fullCSS += this.generateCSSVariables();
        
        fullCSS += '/* Component Styles */\n';
        fullCSS += this.generateComponentCSS();
        
        fullCSS += '/* Layout & Responsive */\n';
        fullCSS += this.generateResponsiveCSS();
        
        fullCSS += '/* Animations */\n';
        fullCSS += this.generateAnimationCSS();
        
        fullCSS += '/* Themes */\n';
        fullCSS += this.generateThemeCSS();

        try {
            // assetsディレクトリが存在しない場合は作成
            const assetsDir = './assets/styles';
            if (!fs.existsSync(assetsDir)) {
                fs.mkdirSync(assetsDir, { recursive: true });
            }

            fs.writeFileSync(this.cssOutputPath, fullCSS);
            console.log(`✅ CSSファイルを生成しました: ${this.cssOutputPath}`);
        } catch (error) {
            console.error('CSSファイルの生成に失敗しました:', error.message);
        }
    }

    // 全HTMLファイルにデザインシステムCSSを適用
    applyToAllPages() {
        console.log('🔄 全ページにデザインシステムを適用中...');
        
        const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
        let updatedCount = 0;

        htmlFiles.forEach(file => {
            try {
                let content = fs.readFileSync(file, 'utf8');
                
                // 既存のデザインシステムリンクをチェック
                if (!content.includes('design-system-generated.css')) {
                    // headタグ内にCSSリンクを追加
                    const headEndIndex = content.indexOf('</head>');
                    if (headEndIndex !== -1) {
                        const cssLink = '    <link rel="stylesheet" href="assets/styles/design-system-generated.css">\n';
                        content = content.slice(0, headEndIndex) + cssLink + content.slice(headEndIndex);
                        
                        fs.writeFileSync(file, content);
                        updatedCount++;
                        console.log(`  ✅ ${file} にデザインシステムを適用しました`);
                    }
                }
            } catch (error) {
                console.error(`  ❌ ${file} の更新に失敗: ${error.message}`);
            }
        });

        console.log(`🎉 ${updatedCount}個のファイルにデザインシステムを適用しました`);
    }

    // カラーパレットを更新
    updateColorPalette(category, colors) {
        console.log(`🎨 カラーパレット「${category}」を更新中...`);
        this.designSystem.color_palette[category] = colors;
        this.saveDesignSystem();
        console.log(`✅ カラーパレット「${category}」を更新しました`);
    }

    // コンポーネントスタイルを更新
    updateComponent(componentType, variant, styles) {
        console.log(`🔧 コンポーネント「${componentType}.${variant}」を更新中...`);
        if (!this.designSystem.components[componentType]) {
            this.designSystem.components[componentType] = {};
        }
        this.designSystem.components[componentType][variant] = styles;
        this.saveDesignSystem();
        console.log(`✅ コンポーネント「${componentType}.${variant}」を更新しました`);
    }

    // テーマを切り替え
    switchTheme(themeName) {
        console.log(`🌈 テーマを「${themeName}」に切り替え中...`);
        
        if (!this.designSystem.themes[themeName]) {
            console.error(`❌ テーマ「${themeName}」が見つかりません`);
            return;
        }

        // 全HTMLファイルのdata-theme属性を更新
        const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
        let updatedCount = 0;

        htmlFiles.forEach(file => {
            try {
                let content = fs.readFileSync(file, 'utf8');
                
                // data-theme属性を更新または追加
                if (content.includes('data-theme=')) {
                    content = content.replace(/data-theme="[^"]*"/, `data-theme="${themeName}"`);
                } else {
                    content = content.replace('<html', `<html data-theme="${themeName}"`);
                }
                
                fs.writeFileSync(file, content);
                updatedCount++;
                console.log(`  ✅ ${file} のテーマを更新しました`);
            } catch (error) {
                console.error(`  ❌ ${file} のテーマ更新に失敗: ${error.message}`);
            }
        });

        console.log(`🎉 ${updatedCount}個のファイルのテーマを「${themeName}」に切り替えました`);
    }

    // 現在のデザインシステム設定を表示
    showCurrentConfig() {
        console.log('🎨 現在のデザインシステム設定:');
        console.log(`名前: ${this.designSystem.design_system.name}`);
        console.log(`バージョン: ${this.designSystem.design_system.version}`);
        console.log(`最終更新: ${this.designSystem.design_system.last_updated}`);
        console.log('\n利用可能なテーマ:');
        Object.keys(this.designSystem.themes).forEach(theme => {
            console.log(`  - ${theme}`);
        });
        console.log('\n利用可能なコンポーネント:');
        Object.keys(this.designSystem.components).forEach(component => {
            console.log(`  - ${component}`);
        });
    }
}

// コマンドライン引数の処理
const args = process.argv.slice(2);
const command = args[0];
const designManager = new DesignManager();

switch (command) {
    case 'generate':
        designManager.generateFullCSS();
        break;
    case 'apply':
        designManager.generateFullCSS();
        designManager.applyToAllPages();
        break;
    case 'theme':
        const themeName = args[1];
        if (!themeName) {
            console.error('❌ テーマ名を指定してください: node design-manager.cjs theme light');
            process.exit(1);
        }
        designManager.switchTheme(themeName);
        break;
    case 'config':
        designManager.showCurrentConfig();
        break;
    case 'help':
    default:
        console.log('BSix.com デザインシステム管理');
        console.log('');
        console.log('使用方法:');
        console.log('  node design-manager.cjs generate    - CSSファイルを生成');
        console.log('  node design-manager.cjs apply       - CSS生成 + 全ページに適用');
        console.log('  node design-manager.cjs theme <name> - テーマを切り替え');
        console.log('  node design-manager.cjs config      - 現在の設定を表示');
        console.log('  node design-manager.cjs help        - このヘルプを表示');
        break;
}
