import "./current-weather.css"

const CurrentWeather = () => {
  return (
    <div className="weather">
      <div className="top">
        <p className="city">Mexico</p>
        <p className="weather-description">Sunny</p>
      </div>
      <img src="icons/01d.png" alt="weather" className="weather-icon" />
    </div>
  )
}

export default CurrentWeather
