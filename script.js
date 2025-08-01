class CurrencyConverter {
    constructor() {
        this.apiUrl = 'https://api.exchangerate-api.com/v4/latest';
        this.currencies = this.getCurrencyList();
        this.exchangeRates = {};
        this.baseCurrency = 'USD';
        this.lastUpdated = null;
        this.updateTimer = null;
        
        this.init();
    }

    getCurrencyList() {
        return {
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
            'NZD': { name: 'New Zealand Dollar', flag: '🇳🇿', symbol: 'NZ },
            'HKD': { name: 'Hong Kong Dollar', flag: '🇭🇰', symbol: 'HK },
            'SEK': { name: 'Swedish Krona', flag: '🇸🇪', symbol: 'kr' },
            'NOK': { name: 'Norwegian Krone', flag: '🇳🇴', symbol: 'kr' },
            'TRY': { name: 'Turkish Lira', flag: '🇹🇷', symbol: '₺' },
            'PLN': { name: 'Polish Zloty', flag: '🇵🇱', symbol: 'zł' },
            'DKK': { name: 'Danish Krone', flag: '🇩🇰', symbol: 'kr' },
            'CZK': { name: 'Czech Koruna', flag: '🇨🇿', symbol: 'Kč' },
            'HUF': { name: 'Hungarian Forint', flag: '🇭🇺', symbol: 'Ft' },
            'ILS': { name: 'Israeli Shekel', flag: '🇮🇱', symbol: '₪' },
            'CLP': { name: 'Chilean Peso', flag: '🇨🇱', symbol: ' },
            'PHP': { name: 'Philippine Peso', flag: '🇵🇭', symbol: '₱' },
            'AED': { name: 'UAE Dirham', flag: '🇦🇪', symbol: 'د.إ' },
            'SAR': { name: 'Saudi Riyal', flag: '🇸🇦', symbol: '﷼' },
            'EGP': { name: 'Egyptian Pound', flag: '🇪🇬', symbol: 'E£' },
            'THB': { name: 'Thai Baht', flag: '🇹🇭', symbol: '฿' },
            'MYR': { name: 'Malaysian Ringgit', flag: '🇲🇾', symbol: 'RM' },
            'IDR': { name: 'Indonesian Rupiah', flag: '🇮🇩', symbol: 'Rp' },
            'VND': { name: 'Vietnamese Dong', flag: '🇻🇳', symbol: '₫' }
        };
    }

    async init() {
        this.setupTheme();
        this.populateCurrencySelects();
        this.bindEvents();
        await this.loadExchangeRates();
        this.updateFavoritePairs();
        this.startAutoRefresh();
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('currency-converter-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    populateCurrencySelects() {
        const fromSelect = document.getElementById('fromCurrency');
        const toSelect = document.getElementById('toCurrency');
        const baseSelect = document.getElementById('baseCurrency');

        [fromSelect, toSelect, baseSelect].forEach(select => {
            select.innerHTML = '';
            Object.entries(this.currencies).forEach(([code, info]) => {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = `${info.flag} ${code} - ${info.name}`;
                select.appendChild(option);
            });
        });

        // Set default values
        fromSelect.value = 'USD';
        toSelect.value = 'EUR';
        baseSelect.value = 'USD';
    }

    async loadExchangeRates() {
        try {
            this.showLoading(true);
            const response = await fetch(`${this.apiUrl}/${this.baseCurrency}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.exchangeRates = data.rates;
            this.lastUpdated = new Date();
            
            this.hideLoading();
            this.displayRates();
            this.convertCurrency();
            this.showSuccess('Exchange rates updated successfully!');
            
        } catch (error) {
            console.error('Failed to fetch rates:', error);
            this.loadDemoRates();
            this.showError('Failed to load live rates. Using demo data.');
        }
    }

    loadDemoRates() {
        // Demo rates for fallback
        this.exchangeRates = {
            'EUR': 0.85, 'GBP': 0.73, 'JPY': 150.25, 'AUD': 1.52, 'CAD': 1.35,
            'CHF': 0.91, 'CNY': 7.24, 'INR': 83.12, 'KRW': 1340.50, 'MXN': 17.05,
            'RUB': 91.50, 'ZAR': 18.75, 'BRL': 5.05, 'SGD': 1.35, 'NZD': 1.65,
            'HKD': 7.83, 'SEK': 10.95, 'NOK': 10.75, 'TRY': 28.50, 'PLN': 4.05,
            'DKK': 6.92, 'CZK': 22.75, 'HUF': 360.25, 'ILS': 3.65, 'CLP': 895.00,
            'PHP': 56.25, 'AED': 3.67, 'SAR': 3.75, 'EGP': 48.50, 'THB': 35.75,
            'MYR': 4.68, 'IDR': 15650.00, 'VND': 24350.00
        };
        
        if (this.baseCurrency !== 'USD') {
            this.exchangeRates['USD'] = 1;
        }
        
        this.lastUpdated = new Date();
        this.hideLoading();
        this.displayRates();
        this.convertCurrency();
    }

    displayRates() {
        const ratesGrid = document.getElementById('ratesGrid');
        ratesGrid.innerHTML = '';

        // Add base currency if not USD
        if (this.baseCurrency !== 'USD') {
            const baseRate = this.baseCurrency === 'USD' ? 1 : (this.exchangeRates['USD'] || 1);
            this.addRateCard(ratesGrid, 'USD', baseRate);
        } else {
            this.addRateCard(ratesGrid, 'USD', 1);
        }

        // Add other currencies
        Object.entries(this.exchangeRates)
            .filter(([code]) => this.currencies[code] && code !== this.baseCurrency)
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([code, rate]) => {
                this.addRateCard(ratesGrid, code, rate);
            });
    }

    addRateCard(container, code, rate) {
        const currency = this.currencies[code];
        if (!currency) return;

        const card = document.createElement('div');
        card.className = 'rate-card';
        card.dataset.currency = code.toLowerCase();
        
        // Generate random change for demo (in real app, this would come from API)
        const change = (Math.random() - 0.5) * 2;
        const changeClass = change >= 0 ? 'positive' : 'negative';
        const changeSymbol = change >= 0 ? '+' : '';

        card.innerHTML = `
            <div class="currency-info">
                <div class="currency-flag">${currency.flag}</div>
                <div class="currency-details">
                    <h4>${code}</h4>
                    <p>${currency.name}</p>
                </div>
            </div>
            <div class="rate-value">
                <div class="rate-number">${this.formatRate(rate)}</div>
                <div class="rate-change ${changeClass}">
                    ${changeSymbol}${Math.abs(change).toFixed(2)}%
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            document.getElementById('toCurrency').value = code;
            this.convertCurrency();
            this.scrollToConverter();
        });

        container.appendChild(card);
    }

    convertCurrency() {
        const amount = parseFloat(document.getElementById('amount').value) || 0;
        const fromCurrency = document.getElementById('fromCurrency').value;
        const toCurrency = document.getElementById('toCurrency').value;

        if (amount <= 0) {
            return;
        }

        let convertedAmount;
        let rate;

        if (fromCurrency === toCurrency) {
            convertedAmount = amount;
            rate = 1;
        } else if (fromCurrency === this.baseCurrency) {
            rate = this.exchangeRates[toCurrency] || 1;
            convertedAmount = amount * rate;
        } else if (toCurrency === this.baseCurrency) {
            rate = 1 / (this.exchangeRates[fromCurrency] || 1);
            convertedAmount = amount * rate;
        } else {
            // Convert through base currency
            const toBaseRate = 1 / (this.exchangeRates[fromCurrency] || 1);
            const fromBaseRate = this.exchangeRates[toCurrency] || 1;
            rate = toBaseRate * fromBaseRate;
            convertedAmount = amount * rate;
        }

        this.displayResult(amount, fromCurrency, convertedAmount, toCurrency, rate);
    }

    displayResult(amount, fromCurrency, convertedAmount, toCurrency, rate) {
        const fromInfo = this.currencies[fromCurrency];
        const toInfo = this.currencies[toCurrency];

        document.getElementById('convertedAmount').textContent = 
            `${this.formatAmount(convertedAmount)} ${toCurrency}`;
        
        document.getElementById('exchangeRate').textContent = 
            `1 ${fromCurrency} = ${this.formatRate(rate)} ${toCurrency}`;
        
        document.getElementById('midRate').textContent = this.formatRate(rate);
        document.getElementById('lastUpdated').textContent = this.getTimeAgo();

        // Animate the result
        const resultSection = document.getElementById('resultSection');
        resultSection.style.transform = 'scale(0.95)';
        setTimeout(() => {
            resultSection.style.transform = 'scale(1)';
        }, 100);
    }

    updateFavoritePairs() {
        const pairs = [
            { from: 'USD', to: 'EUR' },
            { from: 'GBP', to: 'USD' },
            { from: 'USD', to: 'JPY' }
        ];

        pairs.forEach((pair, index) => {
            const rate = this.calculateRate(pair.from, pair.to);
            const pairCard = document.querySelector(`[data-from="${pair.from}"][data-to="${pair.to}"]`);
            if (pairCard) {
                pairCard.querySelector('.pair-rate').textContent = this.formatRate(rate);
            }
        });
    }

    calculateRate(from, to) {
        if (from === to) return 1;
        
        if (from === this.baseCurrency) {
            return this.exchangeRates[to] || 1;
        } else if (to === this.baseCurrency) {
            return 1 / (this.exchangeRates[from] || 1);
        } else {
            const toBaseRate = 1 / (this.exchangeRates[from] || 1);
            const fromBaseRate = this.exchangeRates[to] || 1;
            return toBaseRate * fromBaseRate;
        }
    }

    formatAmount(amount) {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(2) + 'M';
        } else if (amount >= 1000) {
            return amount.toLocaleString('en-US', { maximumFractionDigits: 2 });
        } else if (amount >= 1) {
            return amount.toFixed(2);
        } else {
            return amount.toFixed(4);
        }
    }

    formatRate(rate) {
        if (rate >= 1000) {
            return rate.toLocaleString('en-US', { maximumFractionDigits: 2 });
        } else if (rate >= 100) {
            return rate.toFixed(2);
        } else if (rate >= 1) {
            return rate.toFixed(4);
        } else {
            return rate.toFixed(6);
        }
    }

    getTimeAgo() {
        if (!this.lastUpdated) return 'Never';
        
        const now = new Date();
        const diff = now - this.lastUpdated;
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }

    swapCurrencies() {
        const fromSelect = document.getElementById('fromCurrency');
        const toSelect = document.getElementById('toCurrency');
        
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;
        
        this.convertCurrency();
    }

    clearAmount() {
        document.getElementById('amount').value = '';
        document.getElementById('amount').focus();
    }

    setQuickAmount(amount) {
        document.getElementById('amount').value = amount;
        
        // Update active state
        document.querySelectorAll('.quick-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-amount="${amount}"]`).classList.add('active');
        
        this.convertCurrency();
    }

    filterCurrencies() {
        const searchTerm = document.getElementById('searchCurrency').value.toLowerCase();
        const rateCards = document.querySelectorAll('.rate-card');

        rateCards.forEach(card => {
            const currency = card.dataset.currency;
            const currencyInfo = this.currencies[currency.toUpperCase()];
            const matches = currency.includes(searchTerm) || 
                          currencyInfo?.name.toLowerCase().includes(searchTerm);
            
            card.style.display = matches ? 'flex' : 'none';
        });
    }

    async changeBaseCurrency() {
        const newBase = document.getElementById('baseCurrency').value;
        if (newBase !== this.baseCurrency) {
            this.baseCurrency = newBase;
            await this.loadExchangeRates();
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('currency-converter-theme', newTheme);
    }

    async refreshRates() {
        const fab = document.getElementById('refreshRates');
        fab.classList.add('spinning');
        
        await this.loadExchangeRates();
        this.updateFavoritePairs();
        
        setTimeout(() => {
            fab.classList.remove('spinning');
        }, 1000);
    }

    startAutoRefresh() {
        // Refresh rates every 5 minutes
        this.updateTimer = setInterval(() => {
            this.loadExchangeRates();
        }, 5 * 60 * 1000);
    }

    showLoading(show = true) {
        const spinner = document.getElementById('loadingSpinner');
        const ratesGrid = document.getElementById('ratesGrid');
        
        if (show) {
            spinner.style.display = 'flex';
            ratesGrid.style.display = 'grid';
        } else {
            spinner.style.display = 'none';
        }
    }

    hideLoading() {
        this.showLoading(false);
    }

    showError(message) {
        this.showAlert('error', message);
    }

    showSuccess(message) {
        this.showAlert('success', message);
    }

    showAlert(type, message) {
        const alertId = type === 'error' ? 'errorAlert' : 'successAlert';
        const alert = document.getElementById(alertId);
        
        alert.textContent = message;
        alert.classList.add('show');
        
        setTimeout(() => {
            alert.classList.remove('show');
        }, 4000);
    }

    scrollToConverter() {
        document.querySelector('.converter-card').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    bindEvents() {
        // Amount input events
        const amountInput = document.getElementById('amount');
        amountInput.addEventListener('input', () => {
            this.convertCurrency();
        });

        // Quick amount buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = parseInt(btn.dataset.amount);
                this.setQuickAmount(amount);
            });
        });

        // Clear amount button
        document.getElementById('clearAmount').addEventListener('click', () => {
            this.clearAmount();
        });

        // Currency selects
        document.getElementById('fromCurrency').addEventListener('change', () => {
            this.convertCurrency();
        });

        document.getElementById('toCurrency').addEventListener('change', () => {
            this.convertCurrency();
        });

        // Base currency change
        document.getElementById('baseCurrency').addEventListener('change', () => {
            this.changeBaseCurrency();
        });

        // Swap button
        document.getElementById('swapBtn').addEventListener('click', () => {
            this.swapCurrencies();
        });

        // Search
        document.getElementById('searchCurrency').addEventListener('input', () => {
            this.filterCurrencies();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Refresh button
        document.getElementById('refreshRates').addEventListener('click', () => {
            this.refreshRates();
        });

        // Favorite pairs
        document.querySelectorAll('.pair-card').forEach(card => {
            card.addEventListener('click', () => {
                const from = card.dataset.from;
                const to = card.dataset.to;
                
                document.getElementById('fromCurrency').value = from;
                document.getElementById('toCurrency').value = to;
                this.convertCurrency();
                this.scrollToConverter();
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'r':
                        e.preventDefault();
                        this.refreshRates();
                        break;
                    case 's':
                        e.preventDefault();
                        this.swapCurrencies();
                        break;
                    case 'd':
                        e.preventDefault();
                        this.toggleTheme();
                        break;
                }
            }
        });

        // Enter key on amount input
        amountInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.convertCurrency();
            }
        });

        // Initial conversion
        setTimeout(() => {
            this.convertCurrency();
        }, 100);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CurrencyConverter();
});

// Service Worker registration for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
