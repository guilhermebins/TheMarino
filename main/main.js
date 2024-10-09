async function fetchToken0Price() {
  try {
    const response = await fetch("http://localhost:3000/api/token0price");
    const { token1Symbol, token0Price } = await response.json();
    const formattedPrice = parseFloat(token0Price).toFixed(2);
    document.getElementById("symbol").innerText = `Coin: ${token1Symbol}`;
    document.getElementById("price").innerText = `Price: ${formattedPrice}`;
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("price").innerText = "Failed to load price";
  }
}

setInterval(fetchToken0Price, 30000);
window.onload = fetchToken0Price;

async function registerUser() {
  const userAddress = document.getElementById("userAddress").value;
  try {
    const response = await fetch("http://localhost:3000/api/registerUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userAddress }),
    });
    const data = await response.json();
    console.log("User registered:", data);
  } catch (error) {
    console.error("Error registering user:", error);
  }
}

async function fundAccount() {
  const userAddress = document.getElementById("userAddress").value;
  const amount = document.getElementById("fundAmount").value;
  try {
    const response = await fetch("http://localhost:3000/api/fundAccount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userAddress, amount }),
    });
    const data = await response.json();
    console.log("Account funded:", data);
  } catch (error) {
    console.error("Error funding account:", error);
  }
}

async function sendSignal() {
  const userAddress = document.getElementById("userAddress").value;
  try {
    const response = await fetch("http://localhost:3000/api/sendSignal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userAddress }),
    });
    const data = await response.json();
    console.log("Signal sent:", data);
  } catch (error) {
    console.error("Error sending signal:", error);
  }
}
