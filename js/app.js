const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";

let cryptoData = [];

window.onload = () => {
  fetchData();

  document.getElementById("searchInput").addEventListener("input", () => {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = cryptoData.filter(coin =>
      coin.name.toLowerCase().includes(query)
    );
    renderTable(filtered);
  });
};

function fetchData() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      cryptoData = data;
      renderTable(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      document.getElementById("cryptoTable").innerHTML =
        "<p>⚠️ Failed to load data. Please try again later.</p>";
    });
}

function renderTable(data) {
  if (data.length === 0) {
    document.getElementById("cryptoTable").innerHTML = "<p>No results found.</p>";
    return;
  }

  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price (USD)</th>
          <th>Market Cap</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach((coin) => {
    tableHTML += `
      <tr>
        <td>${coin.name} (${coin.symbol.toUpperCase()})</td>
        <td>$${coin.current_price.toLocaleString()}</td>
        <td>$${coin.market_cap.toLocaleString()}</td>
      </tr>
    `;
  });

  tableHTML += `</tbody></table>`;
  document.getElementById("cryptoTable").innerHTML = tableHTML;
}

function sortTable(key) {
  const sorted = [...cryptoData].sort((a, b) => {
    if (key === "name") {
      return a.name.localeCompare(b.name);
    } else if (key === "price") {
      return b.current_price - a.current_price;
    } else if (key === "market_cap") {
      return b.market_cap - a.market_cap;
    }
  });
  renderTable(sorted);
}
