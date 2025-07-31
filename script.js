const tableBody = document.getElementById("tableBody");
const table = document.getElementById("cryptoTable");
const spinner = document.getElementById("spinner");
const searchInput = document.getElementById("searchInput");

let cryptoData = [];

async function fetchData() {
  spinner.style.display = "block";
  table.style.display = "none";
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1");
    const data = await response.json();
    cryptoData = data;
    displayData(data);
  } catch (error) {
    alert("Failed to fetch data.");
    console.error(error);
  } finally {
    spinner.style.display = "none";
    table.style.display = "table";
  }
}

function displayData(data) {
  tableBody.innerHTML = "";
  data.forEach((coin, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${coin.market_cap_rank}</td>
      <td>${coin.name}</td>
      <td>${coin.symbol.toUpperCase()}</td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td>$${coin.market_cap.toLocaleString()}</td>
    `;
    tableBody.appendChild(row);
  });
}

function sortByPrice() {
  const sorted = [...cryptoData].sort((a, b) => b.current_price - a.current_price);
  displayData(sorted);
}

function sortByMarketCap() {
  const sorted = [...cryptoData].sort((a, b) => b.market_cap - a.market_cap);
  displayData(sorted);
}

function refreshData() {
  fetchData();
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = cryptoData.filter(coin => 
    coin.name.toLowerCase().includes(query) || 
    coin.symbol.toLowerCase().includes(query)
  );
  displayData(filtered);
});

// Initial load
fetchData();

