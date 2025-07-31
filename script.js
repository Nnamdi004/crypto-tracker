const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";

const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const refreshBtn = document.getElementById("refreshBtn");
let cryptoData = [];

function renderTable(data) {
  tableBody.innerHTML = "";
  data.forEach(coin => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${coin.name}</td>
      <td>${coin.symbol.toUpperCase()}</td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td>$${coin.market_cap.toLocaleString()}</td>
      <td style="color:${coin.price_change_percentage_24h >= 0 ? 'lime' : 'red'};">
        ${coin.price_change_percentage_24h.toFixed(2)}%
      </td>
    `;
    tableBody.appendChild(row);
  });
}

async function fetchData() {
  tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Loading data...</td></tr>`;
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    cryptoData = data;
    renderTable(cryptoData);
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Failed to load data.</td></tr>`;
  }
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = cryptoData.filter(c =>
    c.name.toLowerCase().includes(query) || c.symbol.toLowerCase().includes(query)
  );
  renderTable(filtered);
});

document.querySelectorAll("th[data-sort]").forEach(th => {
  th.addEventListener("click", () => {
    const key = th.dataset.sort;
    const sorted = [...cryptoData].sort((a, b) =>
      typeof a[key] === "string"
        ? a[key].localeCompare(b[key])
        : b[key] - a[key]
    );
    renderTable(sorted);
  });
});

refreshBtn.addEventListener("click", fetchData);

window.addEventListener("DOMContentLoaded", fetchData);


