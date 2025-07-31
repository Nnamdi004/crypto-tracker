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
  tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;"><div class="spinner"></div></td></tr>`;
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    cryptoData = data;
    renderTable(cryptoData);
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Failed to load data. Please try again.</td></tr>`;
  }
}

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = cryptoData.filter(coin =>
    coin.name.toLowerCase().includes(term) || coin.symbol.toLowerCase().includes(term)
  );
  renderTable(filtered);
});

refreshBtn.addEventListener("click", fetchData);

document.querySelectorAll("th[data-sort]").forEach(th => {
  th.addEventListener("click", () => {
    const key = th.dataset.sort;
    cryptoData.sort((a, b) => {
      if (typeof a[key] === "string") {
        return a[key].localeCompare(b[key]);
      }
      return b[key] - a[key];
    });
    renderTable(cryptoData);
  });
});

fetchData();

