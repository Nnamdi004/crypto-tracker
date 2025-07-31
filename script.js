const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';
let cryptoData = [];
let ascending = true;
let currentSort = null;

async function fetchData() {
  try {
    document.getElementById("loading").style.display = "block";
    const res = await fetch(API_URL);
    const data = await res.json();
    cryptoData = data;
    renderTable(data);
    populateCurrencyOptions(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    document.getElementById("loading").innerText = "Failed to load data.";
  }
}

function renderTable(data) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  data.forEach(coin => {
    const row = `<tr>
      <td>${coin.name}</td>
      <td>${coin.symbol.toUpperCase()}</td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td>$${coin.market_cap.toLocaleString()}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
  document.getElementById("cryptoTable").style.display = "table";
  document.getElementById("loading").style.display = "none";
}

function sortTable(by) {
  if (currentSort === by) ascending = !ascending;
  else {
    currentSort = by;
    ascending = true;
  }

  const sorted = [...cryptoData].sort((a, b) => {
    let valA = by === 'price' ? a.current_price : a.market_cap;
    let valB = by === 'price' ? b.current_price : b.market_cap;
    return ascending ? valA - valB : valB - valA;
  });
  renderTable(sorted);
}

document.getElementById("searchInput").addEventListener("input", e => {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = cryptoData.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm) ||
    coin.symbol.toLowerCase().includes(searchTerm)
  );
  renderTable(filtered);
});

function populateCurrencyOptions(data) {
  const from = document.getElementById("fromCurrency");
  const to = document.getElementById("toCurrency");
  data.forEach(coin => {
    const option1 = new Option(coin.name, coin.current_price);
    const option2 = new Option(coin.name, coin.current_price);
    from.appendChild(option1);
    to.appendChild(option2);
  });
}

function convertCurrency() {
  const amount = parseFloat(document.getElementById("amount").value);
  const fromVal = parseFloat(document.getElementById("fromCurrency").value);
  const toVal = parseFloat(document.getElementById("toCurrency").value);
  if (!amount || isNaN(fromVal) || isNaN(toVal)) return;

  const converted = (amount * fromVal) / toVal;
  document.getElementById("conversionResult").innerText =
    `Converted: ${converted.toFixed(6)}`;
}

function toggleTheme() {
  document.body.classList.toggle("light-theme");
}

// Fetch data initially and every 30 seconds
fetchData();
setInterval(fetchData, 30000);
