💰 Crypto Tracker Web App

A sleek, modern web application that fetches real-time cryptocurrency data from the CoinGecko API and displays it in an interactive, user-friendly dashboard. It supports live searching, sorting by price or market cap, and includes error handling and responsive design.



🚀 Live Demo

➡️ Visit the Live App: https://nnamdi004.github.io/crypto-tracker/

📦 Features

🔍 Search: Find any coin by name (live filtering).

📊 Real-time data: Fetches top coins with price, symbol, and market cap.

🧮 Sorting: Sort by coin name, price (USD), or market cap.

🌗 Dark Mode UI: Clean design with dark background and electric blue accents.

⚠️ Error Handling: Displays fallback message if the API fails.

🧭 Responsive Layout: Works on desktop, tablet, and mobile.

🧑‍💻 Tech Stack

Tech

Role

HTML5

Page structure

CSS3

Styling + animations

JavaScript (ES6)

Data fetching + logic

CoinGecko API

Real-time crypto data

GitHub Pages

Deployment (or Vercel)

🌍 APIs Used

CoinGecko API

Docs: https://www.coingecko.com/en/api

Endpoint Used: https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd

🛠️ Local Setup Instructions

Clone the repo: 

git clone https://github.com/your-username/crypto-tracker.git

cd crypto-tracker

📁 Folder Structure


crypto-tracker/


├── public/


│   ├── index.html          # Main HTML file


│   └── favicon.ico         # App icon in browser tab


├── src/


│   ├── css/


│   │   └── styles.css      # Styling and animations


│   ├── js/


│   │   └── app.js          # Core logic: fetch + render


├── .gitignore              # Ignores env/temp files


└── README.md               # Project documentation

✨ Customization Tips

🎨 Change Theme Colors: Edit colors in styles.css

🌐 Add More Info: Include additional API fields like price change, volume, etc.

💡 Enhancements: Add currency selector, historical charts, or a watchlist

🛡️ Security and Best Practices

✅ API key not required (CoinGecko is public)

🧾 .gitignore protects temp and system files

⚙️ Modular code with reusable functions

🧼 Clean, commented, and readable JS/CSS

📃 License

This project is licensed under the MIT License.

You are free to use, modify, and distribute with attribution.

👨‍🔬 Author

Nnamdi Onugha

Built with ❤️ as part of a software engineering assignment.

GitHub
