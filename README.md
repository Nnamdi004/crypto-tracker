# Currency Converter Web Application

A modern, responsive currency converter web application that provides real-time exchange rates using the ExchangeRate-API. Built with HTML, CSS, and JavaScript, and containerized with Docker for easy deployment.

## 🌟 Features

- **Real-time Exchange Rates**: Fetches current exchange rates from ExchangeRate-API
- **30+ Currencies**: Support for major world currencies including USD, EUR, GBP, JPY, and more
- **Interactive Interface**: 
  - Currency swap functionality
  - Auto-conversion on input change
  - Search and filter currencies
  - Responsive design for mobile and desktop
- **Live Rate Display**: Grid view of all current exchange rates with search functionality
- **Error Handling**: Graceful handling of API failures with fallback demo data
- **Modern UI**: Glass-morphism design with smooth animations and transitions

## 🚀 Live Demo

The application provides:
- Currency conversion between 30+ major currencies
- Real-time exchange rate display
- Mobile-responsive interface
- Fast and intuitive user experience

## 📋 Prerequisites

- Docker and Docker Compose (for containerized deployment)
- Modern web browser
- Internet connection (for API access)

## 🛠️ Local Development

### Method 1: Direct Browser Access
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/currency-converter.git
   cd currency-converter
   ```

2. Open `index.html` in your web browser
   - The application will work with demo data if API is not accessible
   - For full functionality, you may need to set up API key (see API Configuration section)

### Method 2: Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/currency-converter.git
   cd currency-converter
   ```

2. Build the Docker image:
   ```bash
   docker build -t currency-converter:v1 .
   ```

3. Run the container:
   ```bash
   docker run -p 8080:8080 currency-converter:v1
   ```

4. Access the application at `http://localhost:8080`

## 🔧 API Configuration

The application uses [ExchangeRate-API](https://exchangerate-api.com/) for real-time exchange rates.

### Free Tier (No API Key Required)
The application works out-of-the-box with the free tier endpoint that doesn't require an API key.

### Pro Tier (Optional)
For higher rate limits and additional features:

1. Sign up at [ExchangeRate-API](https://exchangerate-api.com/)
2. Get your free API key
3. Update the `apiKey` variable in the JavaScript code
4. Modify the API endpoint to use the authenticated version

## 🐳 Docker Deployment

### Building and Testing Locally

```bash
# Build the image
docker build -t <dockerhub-username>/currency-converter:v1 .

# Test locally
docker run -p 8080:8080 <dockerhub-username>/currency-converter:v1

# Verify it works
curl http://localhost:8080
```

### Pushing to Docker Hub

```bash
# Login to Docker Hub
docker login

# Push the image
docker push <dockerhub-username>/currency-converter:v1

# Tag as latest
docker tag <dockerhub-username>/currency-converter:v1 <dockerhub-username>/currency-converter:latest
docker push <dockerhub-username>/currency-converter:latest
```

## 🏗️ Lab Infrastructure Deployment

### Prerequisites
- Access to the lab setup: https://github.com/waka-man/web_infra_lab.git
- SSH access to web-01, web-02, and lb-01 machines

### Step 1: Deploy on Web Servers

SSH into both `web-01` and `web-02`:

```bash
# On web-01
ssh user@web-01
docker pull <dockerhub-username>/currency-converter:v1
docker run -d --name currency-converter --restart unless-stopped \
  -p 8080:8080 <dockerhub-username>/currency-converter:v1

# On web-02
ssh user@web-02
docker pull <dockerhub-username>/currency-converter:v1
docker run -d --name currency-converter --restart unless-stopped \
  -p 8080:8080 <dockerhub-username>/currency-converter:v1
```

### Step 2: Configure Load Balancer

SSH into `lb-01` and update HAProxy configuration:

```bash
ssh user@lb-01
```

Edit `/etc/haproxy/haproxy.cfg`:

```haproxy
global
    daemon

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend currency_converter_frontend
    bind *:80
    default_backend currency_converter_backend

backend currency_converter_backend
    balance roundrobin
    option httpchk GET /health
    server web01 172.20.0.11:8080 check
    server web02 172.20.0.12:8080 check
```

Reload HAProxy:
```bash
docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg'
```

### Step 3: Test Load Balancing

```bash
# Test multiple times to see load balancing in action
curl http://localhost
curl http://localhost
curl http://localhost

# Check health endpoint
curl http://localhost/health
```

## 📁 Project Structure

```
currency-converter/
├── index.html          # Main application file
├── style.css           # Stylesheet (embedded in index.html)
├── script.js           # JavaScript logic (embedded in index.html)
├── Dockerfile          # Docker configuration
├── nginx.conf          # Nginx server configuration
├── .gitignore         # Git ignore file
├── README.md          # This file
└── docker-compose.yml # Optional: for local development
```

## 🔍 API Documentation

### ExchangeRate-API
- **Base URL**: `https://api.exchangerate-api.com/v4/latest/{BASE_CURRENCY}`
- **Method**: GET
- **Rate Limit**: 1,500 requests/month (free tier)
- **Documentation**: https://exchangerate-api.com/docs
- **Response Format**:
  ```json
  {
    "base": "USD",
    "date": "2025-08-01",
    "rates": {
      "EUR": 0.85,
      "GBP": 0.73,
      "JPY": 110.0
    }
  }
  ```

### Application Endpoints
- `GET /` - Main application
- `GET /health` - Health check endpoint
- `GET /api/*` - Proxied API requests (optional)

## 🛡️ Security Features

- **Content Security Policy (CSP)**: Restricts resource loading
- **HTTP Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **API Key Protection**: No sensitive data exposed in client code
- **Input Validation**: Sanitized user inputs
- **HTTPS Ready**: Prepared for SSL/TLS termination

## 🚨 Error Handling

The application includes comprehensive error handling:

- **API Failures**: Falls back to demo data when API is unavailable
- **Network Issues**: User-friendly error messages
- **Invalid Inputs**: Input validation with helpful feedback
- **Rate Limiting**: Graceful handling of API rate limits

## 🎯 Challenges Overcome

### 1. CORS Issues
**Challenge**: Browser blocking API requests due to CORS policy.
**Solution**: Implemented Nginx proxy configuration to handle API requests server-side.

### 2. API Rate Limiting
**Challenge**: Free tier API has limited requests per month.
**Solution**: Implemented demo data fallback and efficient caching strategies.

### 3. Mobile Responsiveness
**Challenge**: Complex grid layout not working well on mobile devices.
**Solution**: Implemented responsive CSS grid and mobile-first design approach.

### 4. Real-time Updates
**Challenge**: Providing real-time conversion without overwhelming the API.
**Solution**: Implemented debounced input handling and smart caching.

## 🔧 Development Tools Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Containerization**: Docker with Nginx
- **API**: ExchangeRate-API (REST API)
- **Load Balancer**: HAProxy
- **Version Control**: Git

## 📈 Performance Optimizations

- **Gzip Compression**: Enabled in Nginx configuration
- **Static Asset Caching**: Long-term caching for CSS/JS files
- **Image Optimization**: Efficient use of CSS for visual elements
- **Debounced API Calls**: Prevents excessive API requests
- **Lazy Loading**: Exchange rates loaded asynchronously

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Credits

- **API Provider**: [ExchangeRate-API](https://exchangerate-api.com/) - Free exchange rate API
- **Design Inspiration**: Modern glassmorphism and gradient design trends
- **Icons**: Unicode emoji characters for cross-platform compatibility
- **Infrastructure**: Based on the web infrastructure lab setup

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/currency-converter/issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs
4. Provide system information (OS, browser, Docker version)

## 🔮 Future Enhancements

- Historical exchange rate charts
- Currency trend analysis
- Push notifications for rate changes
- Offline mode with cached rates
- Multi-language support
- Dark/light theme toggle
- Export conversion history
- Cryptocurrency support

---

**Built with ❤️ by [Your Name]**

*Last updated: August 2025*
