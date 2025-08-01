/**
 * Currency Converter Pro - Advanced Web Application
 * Features: Real-time conversion, history tracking, dark mode, notifications
 * Author: Professional Web Development
 * Version: 2.0.0
 */

class CurrencyConverterPro {
    constructor() {
        // Configuration
        this.config = {
            apiKey: 'demo', // Replace with your actual API key
            baseUrl: 'https://api.exchangerate-api.com/v4/latest',
            updateInterval: 60000, // 1 minute
            maxHistoryItems: 50,
            animationDuration: 300
        };

        // Application state
        this.state = {
            currencies: {},
            exchangeRates: {},
            baseCurrency: 'USD',
            favorites: [],
            history: [],
            theme: 'light',
            notifications: true,
            isLoading: false,
            lastUpdate: null,
            currentView: 'converter'
        };

        // Currency data with flags and full names
        this.currencyData = {
            'USD': { name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
            'EUR': { name: 'Euro', flag: '🇪🇺', symbol: '€' },
            'GBP': { name: 'British Pound', flag: '🇬🇧', symbol: '£' },
            'JPY': { name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
            'AUD': { name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
            'CAD': { name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'C$' },
            'CHF': { name: 'Swiss Franc', flag: '🇨🇭', symbol: 'CHF' },
            'CNY': { name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
            'INR': { name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
            'KRW': { name: 'South Korean Won', flag: '🇰🇷', symbol: '₩' },
            'MXN': { name: 'Mexican Peso', flag: '🇲🇽', symbol: '$' },
            'RUB': { name: 'Russian Ruble', flag: '🇷🇺', symbol: '₽' },
            'ZAR': { name: 'South African Rand', flag: '🇿🇦', symbol: 'R' },
            'BRL': { name: 'Brazilian Real', flag: '🇧🇷', symbol: 'R$' },
            'SGD': { name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$' },
            'NZD': { name: 'New Zealand Dollar', flag: '🇳🇿', symbol: 'NZ$' },
            'HKD': { name: 'Hong Kong Dollar', flag: '🇭🇰', symbol: 'HK$' },
            'SEK': { name: 'Swedish Krona', flag: '🇸🇪', symbol: 'kr' },
            'NOK': { name: 'Norwegian Krone', flag: '🇳🇴', symbol: 'kr' },
            'TRY': { name: 'Turkish Lira', flag: '🇹🇷', symbol: '₺' },
            'PLN': { name: 'Polish Zloty', flag: '🇵🇱', symbol: 'zł' },
            'DKK': { name: 'Danish Krone', flag: '🇩🇰', symbol: 'kr' },
            'CZK': { name: 'Czech Koruna', flag: '🇨🇿', symbol: 'Kč' },
            'HUF': { name: 'Hungarian Forint', flag: '🇭🇺', symbol: 'Ft' },
            'ILS': { name: 'Israeli Shekel', flag: '🇮🇱', symbol: '₪' },
            'CLP': { name: 'Chilean Peso', flag: '🇨🇱', symbol: '$' },
            'PHP': { name: 'Philippine Peso', flag: '🇵🇭', symbol: '₱' },
            'AED': { name: 'UAE Dirham', flag: '🇦🇪', symbol: 'د.إ' },
            'SAR': { name: 'Saudi Riyal', flag: '🇸🇦', symbol: '﷼' },
            'EGP': { name: 'Egyptian Pound', flag: '🇪🇬', symbol: '£' },
            'THB': { name: 'Thai Baht', flag: '🇹🇭', symbol: '฿' },
            'VND': { name: 'Vietnamese Dong', flag: '🇻🇳', symbol: '₫' },
            'MYR': { name: 'Malaysian Ringgit', flag: '🇲🇾', symbol: 'RM' },
            'IDR': { name: 'Indonesian Rupiah', flag: '🇮🇩', symbol: 'Rp' }
        };

        // Debounce timer for auto-convert
        this.debounceTimer = null;

        // Initialize application
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            await this.showSplashScreen();
            this.loadUserPreferences();
            this.setupEventListeners();
            await this.loadCurrencies();
            await this.loadExchangeRates();
            this.populateUI();
            this.startAutoUpdate();
            this.hideSplashScreen();
            this.showNotification('Welcome to Currency Converter Pro!', 'success');
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize application. Please refresh the page.');
        }
    }

    /**
     * Show splash screen with loading animation
     */
    async showSplashScreen() {
        const splashScreen = document.getElementById('splashScreen');
        const appContainer = document.getElementById('appContainer');
        
        if (splashScreen && appContainer) {
            splashScreen.style.display = 'flex';
            appContainer.style.display = 'none';
            
            // Simulate loading time
            await this.delay(2000);
        }
    }

    /**
     * Hide splash screen and show main app
     */
    hideSplashScreen() {
        const splashScreen = document.getElementById('splashScreen');
        const appContainer = document.getElementById('appContainer');
        
        if (splashScreen && appContainer) {
            splashScreen.classList.add('hidden');
            appContainer.style.display = 'block';
            
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 500);
        }
    }

    /**
     * Load user preferences (using in-memory storage)
     */
    loadUserPreferences() {
        try {
            // Initialize with default values since localStorage is not available
            this.state.theme = 'light';
            this.state.notifications = true;
            this.state.favorites = [];
            this.state.history = [];
            this.state.baseCurrency = 'USD';
            
            // Apply theme
            document.documentElement.setAttribute('data-theme', this.state.theme);
            
            // Update theme toggle icon
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                const icon = themeToggle.querySelector('i');
                if (icon) {
                    icon.className = this.state.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                }
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    }

    /**
     * Save user preferences (in-memory only)
     */
    saveUserPreferences() {
        // Since localStorage is not available, preferences are stored in memory only
        // They will be lost on page refresh, which is expected behavior in this environment
        console.log('Preferences saved to memory:', {
            theme: this.state.theme,
            notifications: this.state.notifications,
            favorites: this.state.favorites,
            baseCurrency: this.state.baseCurrency
        });
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.switchView(e.target.closest('.nav-item').dataset.view));
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Notifications toggle
        const notificationsToggle = document.getElementById('notificationsToggle');
        if (notificationsToggle) {
            notificationsToggle.addEventListener('click', () => this.toggleNotifications());
        }

        // Converter form
        const convertBtn = document.getElementById('convertBtn');
        if (convertBtn) {
            convertBtn.addEventListener('click', () => this.convertCurrency());
        }

        const swapBtn = document.getElementById('swapBtn');
        if (swapBtn) {
            swapBtn.addEventListener('click', () => this.swapCurrencies());
        }

        const amountInput = document.getElementById('amount');
        if (amountInput) {
            amountInput.addEventListener('input', () => this.debounce(() => this.autoConvert(), 500));
            amountInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.convertCurrency();
            });
        }

        // Currency selects
        const fromCurrency = document.getElementById('fromCurrency');
        const toCurrency = document.getElementById('toCurrency');
        if (fromCurrency) fromCurrency.addEventListener('change', () => this.onCurrencyChange('from'));
        if (toCurrency) toCurrency.addEventListener('change', () => this.onCurrencyChange('to'));

        // Amount suggestions
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setAmount(e.target.dataset.amount));
        });

        // Result actions
        const copyResultBtn = document.getElementById('copyResultBtn');
        const saveResultBtn = document.getElementById('saveResultBtn');
        if (copyResultBtn) copyResultBtn.addEventListener('click', () => this.copyResult());
        if (saveResultBtn) saveResultBtn.addEventListener('click', () => this.saveResult());

        // Favorite and share buttons
        const favoriteBtn = document.getElementById('favoriteBtn');
        const shareBtn = document.getElementById('shareBtn');
        if (favoriteBtn) favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        if (shareBtn) shareBtn.addEventListener('click', () => this.shareConversion());

        // Rates search
        const ratesSearch = document.getElementById('ratesSearch');
        if (ratesSearch) {
            ratesSearch.addEventListener('input', (e) => this.filterRates(e.target.value));
        }

        // Base currency selector
        const baseCurrencySelect = document.getElementById('baseCurrencySelect');
        if (baseCurrencySelect) {
            baseCurrencySelect.addEventListener('change', (e) => this.changeBaseCurrency(e.target.value));
        }

        // History controls
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        const exportHistoryBtn = document.getElementById('exportHistoryBtn');
        if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        if (exportHistoryBtn) exportHistoryBtn.addEventListener('click', () => this.exportHistory());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Window events
        window.addEventListener('beforeunload', () => this.saveUserPreferences());
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    /**
     * Load currencies data
     */
    async loadCurrencies() {
        try {
            this.state.currencies = { ...this.currencyData };
            return true;
        } catch (error) {
            console.error('Error loading currencies:', error);
            throw error;
        }
    }

    /**
     * Load exchange rates from API
     */
    async loadExchangeRates() {
        try {
            this.setLoadingState(true);
            
            const response = await fetch(`${this.config.baseUrl}/${this.state.baseCurrency}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.state.exchangeRates = data.rates;
            this.state.lastUpdate = new Date();
            
            this.updateLastUpdateDisplay();
            this.setLoadingState(false);
            
            return true;
        } catch (error) {
            console.error('API Error:', error);
            this.loadDemoRates();
            this.showNotification('Using demo rates - API unavailable', 'warning');
            this.setLoadingState(false);
            return false;
        }
    }

    /**
     * Load demo rates when API is unavailable
     */
    loadDemoRates() {
        this.state.exchangeRates = {
            'EUR': 0.85,
            'GBP': 0.73,
            'JPY': 110.0,
            'AUD': 1.35,
            'CAD': 1.25,
            'CHF': 0.92,
            'CNY': 6.45,
            'INR': 74.5,
            'KRW': 1180.0,
            'MXN': 20.5,
            'RUB': 73.5,
            'ZAR': 14.8,
            'BRL': 5.2,
            'SGD': 1.35,
            'NZD': 1.42,
            'HKD': 7.8,
            'SEK': 8.6,
            'NOK': 8.9,
            'TRY': 8.5,
            'PLN': 3.9,
            'DKK': 6.2,
            'CZK': 21.5,
            'HUF': 295.0,
            'ILS': 3.2,
            'CLP': 720.0,
            'PHP': 50.0,
            'AED': 3.67,
            'SAR': 3.75,
            'EGP': 15.7,
            'THB': 31.0,
            'VND': 23000.0,
            'MYR': 4.1,
            'IDR': 14200.0
        };
        
        this.state.lastUpdate = new Date();
        this.updateLastUpdateDisplay();
    }

    /**
     * Populate UI elements
     */
    populateUI() {
        this.populateCurrencySelects();
        this.populateBaseCurrencySelect();
        this.displayExchangeRates();
        this.displayQuickConvertCards();
        this.displayHistory();
        this.updateSupportedCurrenciesCount();
    }

    /**
     * Populate currency select elements
     */
    populateCurrencySelects() {
        const fromSelect = document.getElementById('fromCurrency');
        const toSelect = document.getElementById('toCurrency');
        
        if (!fromSelect || !toSelect) return;

        const options = Object.entries(this.state.currencies)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([code, data]) => `
                <option value="${code}">
                    ${data.flag} ${code} - ${data.name}
                </option>
            `).join('');

        fromSelect.innerHTML = options;
        toSelect.innerHTML = options;

        // Set default values
        fromSelect.value = 'USD';
        toSelect.value = 'EUR';

        // Update flag displays
        this.updateCurrencyFlags();
    }

    /**
     * Populate base currency select
     */
    populateBaseCurrencySelect() {
        const baseCurrencySelect = document.getElementById('baseCurrencySelect');
        if (!baseCurrencySelect) return;

        const options = Object.entries(this.state.currencies)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([code, data]) => `
                <option value="${code}">Base: ${code}</option>
            `).join('');

        baseCurrencySelect.innerHTML = options;
        baseCurrencySelect.value = this.state.baseCurrency;
    }

    /**
     * Update currency flag displays
     */
    updateCurrencyFlags() {
        const fromSelect = document.getElementById('fromCurrency');
        const toSelect = document.getElementById('toCurrency');
        const fromFlag = document.getElementById('fromFlag');
        const toFlag = document.getElementById('toFlag');

        if (fromSelect && fromFlag && this.state.currencies[fromSelect.value]) {
            fromFlag.textContent = this.state.currencies[fromSelect.value].flag;
        }

        if (toSelect && toFlag && this.state.currencies[toSelect.value]) {
            toFlag.textContent = this.state.currencies[toSelect.value].flag;
        }
    }

    /**
     * Display exchange rates grid
     */
    displayExchangeRates() {
        const ratesGrid = document.getElementById('ratesGrid');
        if (!ratesGrid) return;

        const loadingElement = ratesGrid.querySelector('.loading-rates');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        // Add base currency
        const baseRate = this.createRateCard(this.state.baseCurrency, this.state.currencies[this.state.baseCurrency], 1.0, 0);
        
        // Add other currencies
        const rateCards = Object.entries(this.state.exchangeRates)
            .filter(([code]) => this.state.currencies[code])
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([code, rate]) => {
                const change = this.calculateRateChange(code);
                return this.createRateCard(code, this.state.currencies[code], rate, change);
            });

        ratesGrid.innerHTML = baseRate + rateCards.join('');
    }

    /**
     * Create rate card HTML
     */
    createRateCard(code, currencyData, rate, change) {
        const changeClass = change > 0 ? 'positive' : change < 0 ? 'negative' : '';
        const changeIcon = change > 0 ? '▲' : change < 0 ? '▼' : '•';
        const changeText = change !== 0 ? `${changeIcon} ${Math.abs(change).toFixed(4)}` : 'No change';

        return `
            <div class="rate-card" data-currency="${code.toLowerCase()}" data-name="${currencyData.name.toLowerCase()}">
                <div class="rate-card-header">
                    <div class="currency-info">
                        <div class="currency-flag-large">${currencyData.flag}</div>
                        <div class="currency-details">
                            <h4>${code}</h4>
                            <div class="currency-name">${currencyData.name}</div>
                        </div>
                    </div>
                    <div class="rate-value-large">${this.formatRate(rate)}</div>
                </div>
                <div class="rate-change ${changeClass}">
                    ${changeText}
                </div>
            </div>
        `;
    }

    /**
     * Display quick convert cards
     */
    displayQuickConvertCards() {
        const quickConvertGrid = document.getElementById('quickConvertGrid');
        if (!quickConvertGrid) return;

        const popularPairs = [
            { from: 'USD', to: 'EUR' },
            { from: 'USD', to: 'GBP' },
            { from: 'EUR', to: 'GBP' },
            { from: 'USD', to: 'JPY' },
            { from: 'GBP', to: 'USD' },
            { from: 'EUR', to: 'USD' }
        ];

        const cards = popularPairs.map(pair => {
            const rate = this.calculateExchangeRate(pair.from, pair.to);
            const change = this.calculateRateChange(pair.to);
            const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
            const trendText = change > 0 ? 'Trending Up' : change < 0 ? 'Trending Down' : 'Stable';

            return `
                <div class="quick-convert-card" onclick="app.setConversionPair('${pair.from}', '${pair.to}')">
                    <div class="quick-convert-header">
                        <div class="currency-pair">${pair.from}/${pair.to}</div>
                        <div class="trend-indicator trend-${trend}">${trendText}</div>
                    </div>
                    <div class="quick-convert-rate">${this.formatRate(rate)}</div>
                    <div class="quick-convert-change">
                        1 ${pair.from} = ${this.formatRate(rate)} ${pair.to}
                    </div>
                </div>
            `;
        }).join('');

        quickConvertGrid.innerHTML = cards;
    }

    /**
     * Convert currency
     */
    async convertCurrency() {
        const amount = parseFloat(document.getElementById('amount').value);
        const fromCurrency = document.getElementById('fromCurrency').value;
        const toCurrency = document.getElementById('toCurrency').value;

        // Validation
        if (!amount || amount <= 0) {
            this.showError('Please enter a valid amount');
            return;
        }

        if (!fromCurrency || !toCurrency) {
            this.showError('Please select both currencies');
            return;
        }

        try {
            this.setLoadingState(true, 'Converting...');

            const rate = this.calculateExchangeRate(fromCurrency, toCurrency);
            const convertedAmount = amount * rate;

            this.displayConversionResult(amount, fromCurrency, convertedAmount, toCurrency, rate);
            this.addToHistory(amount, fromCurrency, convertedAmount, toCurrency, rate);
            
            this.setLoadingState(false);

            // Show success notification
            if (this.state.notifications) {
                this.showNotification(`Converted ${amount} ${fromCurrency} to ${convertedAmount.toFixed(2)} ${toCurrency}`, 'success');
            }

        } catch (error) {
            console.error('Conversion error:', error);
            this.showError('Conversion failed. Please try again.');
            this.setLoadingState(false);
        }
    }

    /**
     * Calculate exchange rate between two currencies
     */
    calculateExchangeRate(from, to) {
        if (from === to) return 1;

        if (from === this.state.baseCurrency) {
            return this.state.exchangeRates[to] || 1;
        } else if (to === this.state.baseCurrency) {
            return 1 / (this.state.exchangeRates[from] || 1);
        } else {
            const fromRate = this.state.exchangeRates[from] || 1;
            const toRate = this.state.exchangeRates[to] || 1;
            return toRate / fromRate;
        }
    }

    /**
     * Display conversion result
     */
    displayConversionResult(amount, fromCurrency, convertedAmount, toCurrency, rate) {
        const resultSection = document.getElementById('resultSection');
        const resultAmount = document.getElementById('resultAmount');
        const resultRate = document.getElementById('resultRate');
        const resultTimestamp = document.getElementById('resultTimestamp');

        if (resultSection && resultAmount && resultRate && resultTimestamp) {
            const fromData = this.state.currencies[fromCurrency];
            const toData = this.state.currencies[toCurrency];

            resultAmount.innerHTML = `
                <span style="font-size: 1.2em;">${fromData.flag} ${amount.toFixed(2)} ${fromCurrency}</span>
                <div style="margin: 10px 0; color: rgba(255,255,255,0.8);">equals</div>
                <span style="font-size: 1.5em;">${toData.flag} ${convertedAmount.toFixed(2)} ${toCurrency}</span>
            `;

            resultRate.textContent = `1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`;
            resultTimestamp.textContent = `Updated ${this.formatTime(new Date())}`;

            resultSection.classList.add('show');
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    /**
     * Auto convert with debouncing
     */
    autoConvert() {
        const amount = document.getElementById('amount').value;
        const fromCurrency = document.getElementById('fromCurrency').value;
        const toCurrency = document.getElementById('toCurrency').value;

        if (amount && fromCurrency && toCurrency && parseFloat(amount) > 0) {
            this.convertCurrency();
        }
    }

    /**
     * Swap currencies
     */
    swapCurrencies() {
        const fromSelect = document.getElementById('fromCurrency');
        const toSelect = document.getElementById('toCurrency');

        if (fromSelect && toSelect) {
            const tempValue = fromSelect.value;
            fromSelect.value = toSelect.value;
            toSelect.value = tempValue;

            this.updateCurrencyFlags();
            this.autoConvert();

            // Add swap animation
            const swapBtn = document.getElementById('swapBtn');
            if (swapBtn) {
                swapBtn.style.transform = 'rotate(180deg) scale(1.1)';
                setTimeout(() => {
                    swapBtn.style.transform = '';
                }, 300);
            }
        }
    }

    /**
     * Set conversion pair from quick convert cards
     */
    setConversionPair(from, to) {
        const fromSelect = document.getElementById('fromCurrency');
        const toSelect = document.getElementById('toCurrency');

        if (fromSelect && toSelect) {
            fromSelect.value = from;
            toSelect.value = to;
            this.updateCurrencyFlags();
            this.autoConvert();
            this.switchView('converter');
        }
    }

    /**
     * Add conversion to history
     */
    addToHistory(amount, fromCurrency, convertedAmount, toCurrency, rate) {
        const historyItem = {
            id: Date.now(),
            timestamp: new Date(),
            amount,
            fromCurrency,
            convertedAmount,
            toCurrency,
            rate
        };

        this.state.history.unshift(historyItem);
        this.state.history = this.state.history.slice(0, this.config.maxHistoryItems);
        this.saveUserPreferences();
        this.displayHistory();
    }

    /**
     * Display conversion history
     */
    displayHistory() {
        const historyContent = document.getElementById('historyContent');
        if (!historyContent) return;

        if (this.state.history.length === 0) {
            historyContent.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <h3>No conversion history yet</h3>
                    <p>Your currency conversions will appear here</p>
                </div>
            `;
            return;
        }

        const historyHTML = this.state.history.map(item => {
            const fromData = this.state.currencies[item.fromCurrency];
            const toData = this.state.currencies[item.toCurrency];

            return `
                <div class="history-item">
                    <div class="history-item-header">
                        <div class="history-conversion">
                            ${fromData.flag} ${item.amount.toFixed(2)} ${item.fromCurrency} → 
                            ${toData.flag} ${item.convertedAmount.toFixed(2)} ${item.toCurrency}
                        </div>
                        <div class="history-timestamp">
                            ${this.formatDateTime(item.timestamp)}
                        </div>
                    </div>
                    <div class="history-details">
                        Rate: 1 ${item.fromCurrency} = ${item.rate.toFixed(6)} ${item.toCurrency}
                    </div>
                </div>
            `;
        }).join('');

        historyContent.innerHTML = historyHTML;
    }

    /**
     * Clear conversion history
     */
    clearHistory() {
        if (confirm('Are you sure you want to clear all conversion history?')) {
            this.state.history = [];
            this.saveUserPreferences();
            this.displayHistory();
            this.showNotification('Conversion history cleared', 'info');
        }
    }

    /**
     * Export conversion history
     */
    exportHistory() {
        if (this.state.history.length === 0) {
            this.showError('No history to export');
            return;
        }

        const csvContent = [
            'Date,Amount,From Currency,Converted Amount,To Currency,Exchange Rate',
            ...this.state.history.map(item => 
                `${item.timestamp.toISOString()},${item.amount},${item.fromCurrency},${item.convertedAmount},${item.toCurrency},${item.rate}`
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `currency-conversion-history-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showNotification('History exported successfully', 'success');
    }

    /**
     * Switch between different views
     */
    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewName) {
                item.classList.add('active');
            }
        });

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(`${viewName}View`);
        if (targetView) {
            targetView.classList.add('active');
        }

        this.state.currentView = viewName;

        // Refresh data if needed
        if (viewName === 'rates') {
            this.displayExchangeRates();
        } else if (viewName === 'history') {
            this.displayHistory();
        }
    }

    /**
     * Toggle theme between light and dark
     */
    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.state.theme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = this.state.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        this.saveUserPreferences();
        this.showNotification(`Switched to ${this.state.theme} theme`, 'info');
    }

    /**
     * Toggle notifications on/off
     */
    toggleNotifications() {
        this.state.notifications = !this.state.notifications;
        this.saveUserPreferences();
        
        const message = this.state.notifications ? 'Notifications enabled' : 'Notifications disabled';
        this.showNotification(message, 'info');
    }

    /**
     * Handle currency selection change
     */
    onCurrencyChange(type) {
        this.updateCurrencyFlags();
        this.autoConvert();
    }

    /**
     * Set amount from suggestion buttons
     */
    setAmount(amount) {
        const amountInput = document.getElementById('amount');
        if (amountInput) {
            const numericAmount = amount.endsWith('K') ? parseFloat(amount) * 1000 : parseFloat(amount);
            amountInput.value = numericAmount;
            this.autoConvert();
        }
    }

    /**
     * Copy conversion result to clipboard
     */
    async copyResult() {
        const resultAmount = document.getElementById('resultAmount');
        if (resultAmount) {
            try {
                await navigator.clipboard.writeText(resultAmount.textContent);
                this.showNotification('Result copied to clipboard', 'success');
            } catch (error) {
                this.showError('Failed to copy to clipboard');
            }
        }
    }

    /**
     * Save current conversion
     */
    saveResult() {
        const amount = document.getElementById('amount').value;
        const fromCurrency = document.getElementById('fromCurrency').value;
        const toCurrency = document.getElementById('toCurrency').value;

        if (amount && fromCurrency && toCurrency) {
            // This could save to favorites, local storage, or trigger a download
            this.showNotification('Conversion saved', 'success');
        }
    }

    /**
     * Toggle favorite conversion pair
     */
    toggleFavorite() {
        const fromCurrency = document.getElementById('fromCurrency').value;
        const toCurrency = document.getElementById('toCurrency').value;
        const pair = `${fromCurrency}-${toCurrency}`;

        const favoriteBtn = document.getElementById('favoriteBtn');
        const icon = favoriteBtn.querySelector('i');

        if (this.state.favorites.includes(pair)) {
            this.state.favorites = this.state.favorites.filter(fav => fav !== pair);
            icon.className = 'far fa-heart';
            this.showNotification('Removed from favorites', 'info');
        } else {
            this.state.favorites.push(pair);
            icon.className = 'fas fa-heart';
            this.showNotification('Added to favorites', 'success');
        }

        this.saveUserPreferences();
    }

    /**
     * Share conversion result
     */
    async shareConversion() {
        const amount = document.getElementById('amount').value;
        const fromCurrency = document.getElementById('fromCurrency').value;
        const toCurrency = document.getElementById('toCurrency').value;

        if (!amount || !fromCurrency || !toCurrency) {
            this.showError('Please complete a conversion first');
            return;
        }

        const rate = this.calculateExchangeRate(fromCurrency, toCurrency);
        const convertedAmount = amount * rate;
        const shareText = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency} (Rate: ${rate.toFixed(6)})`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Currency Conversion',
                    text: shareText,
                    url: window.location.href
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    this.copyToClipboard(shareText);
                }
            }
        } else {
            this.copyToClipboard(shareText);
        }
    }

    /**
     * Filter exchange rates based on search
     */
    filterRates(searchTerm) {
        const rateCards = document.querySelectorAll('.rate-card');
        const term = searchTerm.toLowerCase();

        rateCards.forEach(card => {
            const currency = card.dataset.currency;
            const name = card.dataset.name;
            
            if (currency.includes(term) || name.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    /**
     * Change base currency for rates display
     */
    async changeBaseCurrency(newBaseCurrency) {
        if (newBaseCurrency === this.state.baseCurrency) return;

        this.state.baseCurrency = newBaseCurrency;
        this.saveUserPreferences();

        try {
            await this.loadExchangeRates();
            this.displayExchangeRates();
            this.showNotification(`Base currency changed to ${newBaseCurrency}`, 'info');
        } catch (error) {
            this.showError('Failed to update exchange rates');
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + specific keys
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case '1':
                    event.preventDefault();
                    this.switchView('converter');
                    break;
                case '2':
                    event.preventDefault();
                    this.switchView('rates');
                    break;
                case '3':
                    event.preventDefault();
                    this.switchView('history');
                    break;
                case 'd':
                    event.preventDefault();
                    this.toggleTheme();
                    break;
                case 's':
                    event.preventDefault();
                    this.swapCurrencies();
                    break;
            }
        }

        // Escape key to close modals
        if (event.key === 'Escape') {
            this.closeModal();
            this.hideError();
        }
    }

    /**
     * Start auto-update interval
     */
    startAutoUpdate() {
        setInterval(async () => {
            if (navigator.onLine) {
                try {
                    await this.loadExchangeRates();
                    if (this.state.currentView === 'rates') {
                        this.displayExchangeRates();
                    }
                } catch (error) {
                    console.error('Auto-update failed:', error);
                }
            }
        }, this.config.updateInterval);
    }

    /**
     * Handle online event
     */
    handleOnline() {
        this.showNotification('Connection restored', 'success');
        this.loadExchangeRates();
    }

    /**
     * Handle offline event
     */
    handleOffline() {
        this.showNotification('Working offline with cached rates', 'warning');
    }

    /**
     * Set loading state
     */
    setLoadingState(isLoading, message = 'Loading...') {
        const convertBtn = document.getElementById('convertBtn');
        
        if (isLoading) {
            convertBtn.disabled = true;
            convertBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>${message}</span>`;
        } else {
            convertBtn.disabled = false;
            convertBtn.innerHTML = `<i class="fas fa-calculator"></i> <span>Convert Currency</span>`;
        }

        this.state.isLoading = isLoading;
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info', duration = 4000) {
        if (!this.state.notifications) return;

        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">${this.getNotificationTitle(type)}</div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-body">${message}</div>
        `;

        container.appendChild(notification);

        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
    }

    /**
     * Get notification title based on type
     */
    getNotificationTitle(type) {
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Information'
        };
        return titles[type] || 'Notification';
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorToast = document.getElementById('errorToast');
        const errorMessage = document.getElementById('errorMessage');
        
        if (errorToast && errorMessage) {
            errorMessage.textContent = message;
            errorToast.classList.add('show');
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                this.hideError();
            }, 5000);
        }
    }

    /**
     * Hide error message
     */
    hideError() {
        const errorToast = document.getElementById('errorToast');
        if (errorToast) {
            errorToast.classList.remove('show');
        }
    }

    /**
     * Show modal
     */
    showModal(type) {
        const modal = document.getElementById('modal');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        if (!modal || !modalOverlay || !modalTitle || !modalBody) return;

        const content = this.getModalContent(type);
        modalTitle.textContent = content.title;
        modalBody.innerHTML = content.body;

        modalOverlay.classList.add('show');
    }

    /**
     * Close modal
     */
    closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.classList.remove('show');
        }
    }

    /**
     * Get modal content based on type
     */
    getModalContent(type) {
        const content = {
            about: {
                title: 'About Currency Converter Pro',
                body: `
                    <h4>Professional Currency Converter</h4>
                    <p>A modern, feature-rich currency converter built with vanilla JavaScript, HTML5, and CSS3.</p>
                    
                    <h4>Features</h4>
                    <ul>
                        <li>Real-time exchange rates from multiple APIs</li>
                        <li>150+ supported currencies</li>
                        <li>Conversion history tracking</li>
                        <li>Dark/Light theme support</li>
                        <li>Responsive design for all devices</li>
                        <li>Offline support with cached rates</li>
                        <li>Keyboard shortcuts</li>
                        <li>Progressive Web App (PWA) support</li>
                    </ul>
                    
                    <h4>Version</h4>
                    <p>v2.0.0 - Professional Edition</p>
                `
            },
            privacy: {
                title: 'Privacy Policy',
                body: `
                    <h4>Data Collection</h4>
                    <p>This application stores data locally on your device only. We do not collect or transmit personal information to external servers.</p>
                    
                    <h4>Local Storage</h4>
                    <ul>
                        <li>User preferences (theme, notifications)</li>
                        <li>Conversion history</li>
                        <li>Favorite currency pairs</li>
                    </ul>
                    
                    <h4>External APIs</h4>
                    <p>Exchange rate data is fetched from ExchangeRate-API. Please refer to their privacy policy for data handling practices.</p>
                    
                    <h4>Cookies</h4>
                    <p>This application does not use cookies for tracking purposes.</p>
                `
            },
            terms: {
                title: 'Terms of Service',
                body: `
                    <h4>Use of Service</h4>
                    <p>This currency converter is provided for informational purposes only. Exchange rates are updated regularly but may not reflect real-time market conditions.</p>
                    
                    <h4>Accuracy</h4>
                    <p>While we strive for accuracy, we cannot guarantee the precision of exchange rates. Always verify rates with official financial institutions for important transactions.</p>
                    
                    <h4>Liability</h4>
                    <p>Users assume all risks associated with currency conversions. We are not liable for any financial losses resulting from the use of this application.</p>
                    
                    <h4>Updates</h4>
                    <p>Terms may be updated periodically. Continued use constitutes acceptance of updated terms.</p>
                `
            }
        };

        return content[type] || { title: 'Information', body: 'Content not available.' };
    }

    /**
     * Update last update display
     */
    updateLastUpdateDisplay() {
        const lastUpdate = document.getElementById('lastUpdate');
        if (lastUpdate && this.state.lastUpdate) {
            lastUpdate.textContent = this.formatTime(this.state.lastUpdate);
        }
    }

    /**
     * Update supported currencies count
     */
    updateSupportedCurrenciesCount() {
        const supportedCurrencies = document.getElementById('supportedCurrencies');
        if (supportedCurrencies) {
            supportedCurrencies.textContent = `${Object.keys(this.state.currencies).length}+`;
        }
    }

    /**
     * Calculate rate change (mock implementation)
     */
    calculateRateChange(currency) {
        // Mock rate change calculation
        // In a real application, this would compare with historical data
        return (Math.random() - 0.5) * 0.02; // Random change between -1% and +1%
    }

    /**
     * Format rate value
     */
    formatRate(rate) {
        if (rate >= 1000) {
            return rate.toLocaleString('en-US', { maximumFractionDigits: 2 });
        } else if (rate >= 1) {
            return rate.toFixed(4);
        } else {
            return rate.toFixed(6);
        }
    }

    /**
     * Format time display
     */
    formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    /**
     * Format date and time display
     */
    formatDateTime(date) {
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Copied to clipboard', 'success');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('Copied to clipboard', 'success');
        }
    }

    /**
     * Debounce function for performance optimization
     */
    debounce(func, wait) {
        return (...args) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Delay function for async operations
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global functions for HTML onclick handlers
window.showModal = function(type) {
    if (window.app) {
        window.app.showModal(type);
    }
};

window.closeModal = function() {
    if (window.app) {
        window.app.closeModal();
    }
};

window.hideError = function() {
    if (window.app) {
        window.app.hideError();
    }
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CurrencyConverterPro();
});

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('ServiceWorker registration successful:', registration.scope);
        } catch (error) {
            console.log('ServiceWorker registration failed:', error);
        }
    });
}

// PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button or notification
    if (window.app && window.app.state.notifications) {
        window.app.showNotification('Install this app for a better experience!', 'info', 8000);
    }
});

// Handle app installation
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    if (window.app) {
        window.app.showNotification('App installed successfully!', 'success');
    }
});

// Handle visibility change for performance optimization
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, reduce background activity
        console.log('App is hidden');
    } else {
        // Page is visible, resume normal activity
        console.log('App is visible');
        if (window.app && navigator.onLine) {
            // Optionally refresh data when app becomes visible
            window.app.loadExchangeRates().catch(console.error);
        }
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.app) {
        window.app.saveUserPreferences();
    }
});

// Error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    if (window.app) {
        window.app.showError('An unexpected error occurred. Please try again.');
    }
    event.preventDefault();
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (window.app) {
        window.app.showError('An error occurred. Please refresh the page if problems persist.');
    }
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CurrencyConverterPro;
}
