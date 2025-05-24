import React, { useState } from 'react';

const API_KEY = 'demo'; // Replace with your Alpha Vantage API key or use a mock API

function App() {
  const [symbols, setSymbols] = useState('');
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStockPrice = async (symbol) => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol.trim()}&apikey=${API_KEY}`
      );
      const data = await response.json();
      if (data['Global Quote'] && data['Global Quote']['05. price']) {
        return {
          symbol: symbol.trim().toUpperCase(),
          price: parseFloat(data['Global Quote']['05. price']),
        };
      } else {
        return { symbol: symbol.trim().toUpperCase(), price: null };
      }
    } catch (err) {
      return { symbol: symbol.trim().toUpperCase(), price: null };
    }
  };

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    const symbolList = symbols.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
    if (symbolList.length === 0) {
      setError('Please enter at least one stock symbol.');
      setLoading(false);
      return;
    }
    const results = [];
    for (const symbol of symbolList) {
      const result = await fetchStockPrice(symbol);
      results.push(result);
    }
    setStockData(results);
    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>Stock Price Aggregation</h1>
      <div>
        <input
          type="text"
          placeholder="Enter stock symbols separated by commas"
          value={symbols}
          onChange={(e) => setSymbols(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleFetch} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Prices'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price (USD)</th>
          </tr>
        </thead>
        <tbody>
          {stockData.map(({ symbol, price }) => (
            <tr key={symbol}>
              <td>{symbol}</td>
              <td>{price !== null ? price.toFixed(2) : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="note">* Prices fetched from Alpha Vantage API (demo key)</p>
    </div>
  );
}

export default App;
