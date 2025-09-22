#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class LinkManager {
    constructor() {
        this.configPath = './site-config.json';
        this.config = this.loadConfig();
    }

    loadConfig() {
        try {
            const configData = fs.readFileSync(this.configPath, 'utf8');
            return JSON.parse(configData);
        } catch (error) {
            console.error('設定ファイルの読み込みに失敗しました:', error.message);
            process.exit(1);
        }
    }

    saveConfig() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
            console.log('✅ 設定ファイルを更新しました');
        } catch (error) {
            console.error('設定ファイルの保存に失敗しました:', error.message);
        }
    }

    // 全HTMLファイルのリンクを現在のバージョンに更新
    updateAllLinks() {
        console.log('🔄 全ページのリンクを更新中...');
        
        const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
        const currentPages = this.config.page_versions.current;
        let updatedCount = 0;

        htmlFiles.forEach(file => {
            try {
                let content = fs.readFileSync(file, 'utf8');
                let modified = false;

                // 各ページタイプのリンクを更新
                Object.entries(currentPages).forEach(([pageType, fileName]) => {
                    // 古いリンクパターンを検索・置換
                    const oldPatterns = this.getOldLinkPatterns(pageType);
                    
                    oldPatterns.forEach(oldPattern => {
                        const regex = new RegExp(`href=["']${oldPattern}["']`, 'g');
                        if (content.match(regex)) {
                            content = content.replace(regex, `href="${fileName}"`);
                            modified = true;
                        }
                    });
                });

                if (modified) {
                    fs.writeFileSync(file, content);
                    updatedCount++;
                    console.log(`  ✅ ${file} を更新しました`);
                }
            } catch (error) {
                console.error(`  ❌ ${file} の更新に失敗: ${error.message}`);
            }
        });

        console.log(`🎉 ${updatedCount}個のファイルのリンクを更新しました`);
    }

    // 古いリンクパターンを取得
    getOldLinkPatterns(pageType) {
        const patterns = [];
        
        // 過去のバージョンから古いパターンを収集
        if (this.config.page_versions.previous[pageType]) {
            patterns.push(this.config.page_versions.previous[pageType]);
        }

        // 既知の古いパターンを追加
        switch (pageType) {
            case 'teams':
                patterns.push('teams.html', 'teams-synced.html', 'teams-corrected.html', 'teams-comparison-detailed.html');
                break;
            case 'team_detail_liverpool':
                patterns.push('liverpool.html', 'liverpool-enhanced.html');
                break;
            case 'stats':
                patterns.push('stats-corrected.html', 'stats-accurate.html');
                break;
            case 'fixtures':
                patterns.push('fixtures-corrected.html', 'fixtures-synced.html', 'fixtures-japan.html');
                break;
        }

        return patterns;
    }

    // 特定のバージョンにロールバック
    rollbackToVersion(version) {
        console.log(`🔄 バージョン ${version} にロールバック中...`);
        
        const rollbackPoint = this.config.rollback_points.find(rp => rp.version === version);
        if (!rollbackPoint) {
            console.error(`❌ バージョン ${version} が見つかりません`);
            return;
        }

        // 現在のバージョンをバックアップ
        this.config.page_versions.backup = { ...this.config.page_versions.current };
        
        // ロールバック先のページ設定を適用
        Object.entries(rollbackPoint.pages).forEach(([pageType, fileName]) => {
            this.config.page_versions.current[pageType] = fileName;
        });

        this.saveConfig();
        this.updateAllLinks();
        
        console.log(`✅ バージョン ${version} へのロールバックが完了しました`);
    }

    // 新しいページバージョンを追加
    addPageVersion(pageType, fileName, description = '') {
        console.log(`📝 新しいページバージョンを追加: ${pageType} -> ${fileName}`);
        
        // 現在のバージョンを過去のバージョンに移動
        if (this.config.page_versions.current[pageType]) {
            this.config.page_versions.previous[pageType] = this.config.page_versions.current[pageType];
        }
        
        // 新しいバージョンを設定
        this.config.page_versions.current[pageType] = fileName;
        
        this.saveConfig();
        console.log(`✅ ${pageType} のページバージョンを ${fileName} に更新しました`);
    }

    // リンク整合性チェック
    checkLinkIntegrity() {
        console.log('🔍 リンク整合性をチェック中...');
        
        const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));
        const currentPages = this.config.page_versions.current;
        const issues = [];

        htmlFiles.forEach(file => {
            try {
                const content = fs.readFileSync(file, 'utf8');
                
                // hrefパターンを検索
                const hrefMatches = content.match(/href=["'][^"']*\.html["']/g);
                if (hrefMatches) {
                    hrefMatches.forEach(match => {
                        const linkedFile = match.match(/href=["']([^"']*\.html)["']/)[1];
                        
                        // 現在のページバージョンと一致するかチェック
                        const isCurrentVersion = Object.values(currentPages).includes(linkedFile);
                        const fileExists = fs.existsSync(linkedFile);
                        
                        if (!isCurrentVersion && fileExists) {
                            issues.push({
                                file: file,
                                link: linkedFile,
                                type: 'outdated_link',
                                message: `古いバージョンのリンクが残っています`
                            });
                        } else if (!fileExists) {
                            issues.push({
                                file: file,
                                link: linkedFile,
                                type: 'broken_link',
                                message: `リンク先のファイルが存在しません`
                            });
                        }
                    });
                }
            } catch (error) {
                issues.push({
                    file: file,
                    type: 'read_error',
                    message: `ファイルの読み込みエラー: ${error.message}`
                });
            }
        });

        if (issues.length === 0) {
            console.log('✅ リンク整合性に問題はありません');
        } else {
            console.log(`⚠️  ${issues.length}個の問題が見つかりました:`);
            issues.forEach(issue => {
                console.log(`  - ${issue.file}: ${issue.message} (${issue.link || 'N/A'})`);
            });
        }

        return issues;
    }

    // 現在の設定を表示
    showCurrentConfig() {
        console.log('📋 現在の設定:');
        console.log(`サイト名: ${this.config.site_info.name}`);
        console.log(`バージョン: ${this.config.site_info.version}`);
        console.log(`最終更新: ${this.config.site_info.last_updated}`);
        console.log('\n現在のページバージョン:');
        Object.entries(this.config.page_versions.current).forEach(([type, file]) => {
            console.log(`  ${type}: ${file}`);
        });
    }

    // 利用可能なロールバックポイントを表示
    showRollbackPoints() {
        console.log('📚 利用可能なロールバックポイント:');
        this.config.rollback_points.forEach(point => {
            console.log(`  ${point.version} (${point.date}): ${point.description}`);
        });
    }
}

// コマンドライン引数の処理
const args = process.argv.slice(2);
const command = args[0];
const linkManager = new LinkManager();

switch (command) {
    case 'update':
        linkManager.updateAllLinks();
        break;
    case 'check':
        linkManager.checkLinkIntegrity();
        break;
    case 'rollback':
        const version = args[1];
        if (!version) {
            console.error('❌ バージョンを指定してください: node link-manager.js rollback 1.0.0');
            process.exit(1);
        }
        linkManager.rollbackToVersion(version);
        break;
    case 'add':
        const pageType = args[1];
        const fileName = args[2];
        if (!pageType || !fileName) {
            console.error('❌ ページタイプとファイル名を指定してください: node link-manager.js add teams new-teams.html');
            process.exit(1);
        }
        linkManager.addPageVersion(pageType, fileName);
        break;
    case 'config':
        linkManager.showCurrentConfig();
        break;
    case 'rollback-points':
        linkManager.showRollbackPoints();
        break;
    case 'help':
    default:
        console.log('BSix.com リンク管理システム');
        console.log('');
        console.log('使用方法:');
        console.log('  node link-manager.js update              - 全リンクを現在のバージョンに更新');
        console.log('  node link-manager.js check               - リンク整合性をチェック');
        console.log('  node link-manager.js rollback <version>  - 指定バージョンにロールバック');
        console.log('  node link-manager.js add <type> <file>   - 新しいページバージョンを追加');
        console.log('  node link-manager.js config              - 現在の設定を表示');
        console.log('  node link-manager.js rollback-points     - ロールバックポイントを表示');
        console.log('  node link-manager.js help                - このヘルプを表示');
        break;
}
