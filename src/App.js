import "./App.css"
import Search from "./components/search/search"
import Forecast from "./components/forecast/forecast"
import CurrentWeather from "./components/current-weather/current-weather"
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api"
import { useState, useEffect, Fragment } from "react"

function App() {
  const [loading, setLoading] = useState(null)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitudeGeoLoc = position.coords.latitude
      const longitudeGeoLoc = position.coords.longitude
      handleOnSearchChange({ value: `${latitudeGeoLoc} ${longitudeGeoLoc}` })
    })
    console.log("renderizado")
  }, [])
  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ")
    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
    )
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
    )

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        console.log(response)
        const weatherResponse = await response[0].json()
        const forecastResponse = await response[1].json()
        console.log(weatherResponse)
        console.log(forecastResponse)

        setCurrentWeather({ city: weatherResponse.name, ...weatherResponse })
        setForecast({ city: searchData.forecastResponse, ...forecastResponse })
      })
      .catch((err) => console.log(err))
  }

  return (
    <>
      <div className="container">
        <Search onSearchChange={handleOnSearchChange} />
        {currentWeather && <CurrentWeather data={currentWeather} />}
        {forecast && <Forecast data={forecast} />}
      </div>
      <div className="loading">
        <span>loading</span>
      </div>
    </>
  )
}

export default App
