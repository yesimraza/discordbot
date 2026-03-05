const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

class CookieHandler {
    constructor() {
        this.cookiesFile = path.join(__dirname, '..', 'cookies.json');
        this.appStateFile = path.join(__dirname, '..', 'appstate.json');
    }

    async getCookies() {
        try {
            const data = await fs.readJson(this.cookiesFile);
            return data;
        } catch (e) {
            return null;
        }
    }

    parseCookieString(cookieString) {
        const cookies = [];
        const pairs = cookieString.split(';');
        
        for (const pair of pairs) {
            const [key, ...valueParts] = pair.trim().split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=');
                cookies.push({
                    key: key,
                    value: decodeURIComponent(value),
                    domain: 'facebook.com',
                    path: '/',
                    hostOnly: false,
                    creation: new Date().toISOString(),
                    lastAccessed: new Date().toISOString()
                });
            }
        }
        
        return cookies;
    }

    async generateAppStateFromCookies(cookieString) {
        try {
            const jar = {
                cookies: this.parseCookieString(cookieString)
            };
            
            const c_user = jar.cookies.find(c => c.key === 'c_user');
            const xs = jar.cookies.find(c => c.key === 'xs');
            const fr = jar.cookies.find(c => c.key === 'fr');
            const datr = jar.cookies.find(c => c.key === 'datr');
            const sb = jar.cookies.find(c => c.key === 'sb');
            
            if (!c_user || !xs) {
                throw new Error('Missing required cookies: c_user or xs');
            }

            const appState = jar.cookies.map(cookie => ({
                key: cookie.key,
                value: cookie.value,
                domain: cookie.domain || 'facebook.com',
                path: cookie.path || '/',
                hostOnly: cookie.hostOnly || false,
                creation: new Date().toISOString(),
                lastAccessed: new Date().toISOString()
            }));

            if (fr) {
                appState.push({
                    key: 'fr',
                    value: fr.value,
                    domain: 'facebook.com',
                    path: '/',
                    secure: true,
                    httpOnly: true,
                    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                    hostOnly: false,
                    creation: new Date().toISOString(),
                    lastAccessed: new Date().toISOString()
                });
            }

            return appState;
        } catch (error) {
            console.error('Error generating appstate from cookies:', error.message);
            throw error;
        }
    }

    async validateCookies(cookieString) {
        try {
            const c_userMatch = cookieString.match(/c_user=([^;]+)/);
            const xsMatch = cookieString.match(/xs=([^;]+)/);
            
            if (!c_userMatch || !xsMatch) {
                return { valid: false, reason: 'Missing required cookies' };
            }

            const userId = c_userMatch[1];
            const xs = xsMatch[1];

            return { 
                valid: true, 
                userId: userId,
                xs: xs
            };
        } catch (error) {
            return { valid: false, reason: error.message };
        }
    }

    async refreshAppState() {
        try {
            const cookieData = await this.getCookies();
            if (!cookieData || !cookieData.cookies) {
                throw new Error('No cookies found');
            }

            console.log('[COOKIE] Refreshing appstate from cookies...');
            const newAppState = await this.generateAppStateFromCookies(cookieData.cookies);
            
            await fs.writeJson(this.appStateFile, newAppState, { spaces: 4 });
            
            await fs.writeJson(this.cookiesFile, {
                ...cookieData,
                lastUpdated: new Date().toISOString()
            }, { spaces: 4 });

            console.log('[COOKIE] Appstate refreshed successfully!');
            return newAppState;
        } catch (error) {
            console.error('[COOKIE] Error refreshing appstate:', error.message);
            throw error;
        }
    }

    async checkAndRefreshAppState() {
        try {
            if (!await fs.pathExists(this.appStateFile)) {
                console.log('[COOKIE] Appstate file not found, generating from cookies...');
                return await this.refreshAppState();
            }

            const appState = await fs.readJson(this.appStateFile);
            
            const c_user = appState.find(c => c.key === 'c_user');
            const xs = appState.find(c => c.key === 'xs');
            
            if (!c_user || !xs) {
                console.log('[COOKIE] Appstate missing required cookies, refreshing...');
                return await this.refreshAppState();
            }

            const currentCookies = await this.getCookies();
            if (!currentCookies || !currentCookies.cookies) {
                throw new Error('No cookies available');
            }

            const currentCUser = currentCookies.cookies.match(/c_user=([^;]+)/);
            const currentXs = currentCookies.cookies.match(/xs=([^;]+)/);
            
            if (currentCUser && currentXs) {
                if (c_user.value !== currentCUser[1]) {
                    console.log('[COOKIE] User mismatch, refreshing appstate...');
                    return await this.refreshAppState();
                }
            }

            return appState;
        } catch (error) {
            console.error('[COOKIE] Error checking appstate:', error.message);
            throw error;
        }
    }

    async isLoggedIn(appState) {
        try {
            const c_user = appState.find(c => c.key === 'c_user');
            const xs = appState.find(c => c.key === 'xs');
            
            if (!c_user || !xs) {
                return false;
            }

            const response = await axios.get('https://www.facebook.com/', {
                headers: {
                    'Cookie': `c_user=${c_user.value};xs=${xs.value}`,
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Mobile/15E148 Safari/604.1'
                },
                timeout: 10000
            });

            if (response.data.includes('c_user') || response.headers['set-cookie']) {
                return true;
            }

            return false;
        } catch (error) {
            return false;
        }
    }
}

module.exports = new CookieHandler();
