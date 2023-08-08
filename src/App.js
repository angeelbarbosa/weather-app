import "./App.css"
import Search from "./components/search/search"
import Forecast from "./components/forecast/forecast"
import CurrentWeather from "./components/current-weather/current-weather"
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api"
import { useState, useEffect, Fragment } from "react"
import { BsFillMoonStarsFill } from "react-icons/bs"

function App() {
  const [loading, setLoading] = useState(null)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [forecast, setForecast] = useState(null)
  const Loading = () => {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }
  useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (e.matches) {
          setDarkMode(true)
        } else {
          setDarkMode(false)
        }
      })

    const initialTheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches

    if (initialTheme) {
      setDarkMode(true)
    } else {
      setDarkMode(false)
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitudeGeoLoc = position.coords.latitude
      const longitudeGeoLoc = position.coords.longitude
      handleOnSearchChange({ value: `${latitudeGeoLoc} ${longitudeGeoLoc}` })
    })
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
        setLoading(false)
      })
      .catch((err) => console.log(err))
  }

  return (
    <>
      <div className="container">
        <nav className="nav-bar">
          <Search onSearchChange={handleOnSearchChange} darkMode={darkMode} />
          <ul className="right-side">
            <li className="moon">
              <BsFillMoonStarsFill
                onClick={() => {
                  setDarkMode((previousValue) => !previousValue)
                }}
              />
            </li>
          </ul>
        </nav>
        {currentWeather && (
          <CurrentWeather data={currentWeather} darkMode={darkMode} />
        )}
        {forecast && <Forecast data={forecast} darkMode={darkMode} />}
      </div>
      {loading && <Loading />}
    </>
  )
}

export default App
