import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [unit, setUnit] = useState("C");
  const [history, setHistory] = useState([]);

  async function handleSearch(searchCity = city) {
    setError("")

    const trimmedcity = searchCity.trim()
    if (trimmedcity === "") {
      setWeather(null)
      setError("Enter a city")
      return
    }

    setLoading(true)
    setWeather(null)

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${trimmedcity}&appid=e8dbcec7ccf15f3243fafe93cb7a48cf&units=metric`
    )

    const data = await response.json()

    if (data.cod !== 200) {
      setError("City not found")
      setWeather(null)
    } else {
      setWeather(data)

      if (!history.includes(trimmedcity)) {

        let newHistory = [trimmedcity];
        for (let i = 0; i < history.length && newHistory.length < 5; i++) {
          newHistory.push(history[i]);
        }

        setHistory(newHistory);
        localStorage.setItem('history',JSON.stringify(newHistory))
      }
    }
    setCity("");
    setLoading(false)
  }

  useEffect(() => {
    let historyFromLS = localStorage.getItem('history')
    if(historyFromLS){
     let cities = JSON.parse(historyFromLS)
     setHistory(cities)
    }
  },[])

  function toggleUnit() {
    setUnit(unit === "C" ? "F" : "C");
  }

 function handleChange(e) {
    setCity(e.target.value);
  }
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  let pressure = "-";
  let condition = "-";
  let humidity = "-";
  let wind = "-";
  let icon = null;
  let tempC = null;
  let feelsC = null;

  if (weather) {
    pressure = weather.main.pressure + " hPa";
    humidity = weather.main.humidity + "%";
    wind = weather.wind.speed + " m/s";
    tempC = weather.main.temp;
    feelsC = weather.main.feels_like;

    if (weather.weather && weather.weather.length > 0) {
      condition = weather.weather[0].main;
      icon = weather.weather[0].icon;
    }
  }
  function convert(t) {
    if (unit === "C") {
      return t + "°C";
    } else {
      let f = (t * 9) / 5 + 32;
      return f.toFixed(1) + "°F";
    }
  }
  const temperature = weather ? convert(tempC) : "-";
  const feelsLike = weather ? convert(feelsC) : "-";

  return (
    <div className="app">

      <h1 className="title">Weatherly</h1>

      <div className="search-section">
        <input
          value={city}
          onChange={handleChange}
          
          onKeyDown={handleKeyDown}
          placeholder="Enter City"
        />

        <button onClick={() => handleSearch()} disabled={loading}>
          Search
        </button>
      </div>

      <div className="history">
        {history.map((c, i) => (
          <button
            key={i}
            className="history-btn"
            onClick={() => {
              handleSearch(c)
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="status-area">
        {loading && <p className="status">Fetching weather...</p>}
        {!loading && error && <p className="status error">{error}</p>}
      </div>

      <div className="weather-card">

        <div className="weather-icon">
          {icon && (
            <img
              src={`https://openweathermap.org/img/w/${icon}.png`}
              alt="Weather icon"
            />
          )}
        </div>

        <div className="weather-container">

          <div className="weather-box">
            <span>Pressure</span>
            <p>{pressure}</p>
          </div>

          <div className="weather-box">
            <span>Temperature</span>
            <p>{temperature}</p>
          </div>

          <div className="weather-box">
            <span>Condition</span>
            <p>{condition}</p>
          </div>

          <div className="weather-box">
            <span>Humidity</span>
            <p>{humidity}</p>
          </div>

          <div className="weather-box">
            <span>Wind Speed</span>
            <p>{wind}</p>
          </div>

          <div className="weather-box">
            <span>Feels Like</span>
            <p>{feelsLike}</p>
          </div>

        </div>

      </div>

      <button className="toggle-btn" onClick={toggleUnit}>
        Switch to {unit === "C" ? "Fahrenheit" : "Celsius"}
      </button>

    </div>
  )
}

export default App