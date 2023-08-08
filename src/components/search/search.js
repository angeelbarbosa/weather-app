import { useState } from "react"
import { AsyncPaginate } from "react-select-async-paginate"
import { GEO_API_URL, geoApiOptions } from "../../api"

const Search = ({ onSearchChange, darkMode }) => {
  const [search, setSearch] = useState(null)

  const handleOnChange = (searchData) => {
    console.log(searchData)
    setSearch(searchData)
    onSearchChange(searchData)
  }

  const loadOptions = (inputValue) => {
    console.log(inputValue)
    return fetch(
      `${GEO_API_URL}/cities?minPopulation=1000&namePrefix=${inputValue}`,
      geoApiOptions
    )
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        console.log(response)
        return {
          options: response.data.map((city) => {
            console.log(city)
            return {
              value: `${city.latitude} ${city.longitude}`,
              label: `${city.name}, ${city.region}, ${city.countryCode}`,
            }
          }),
        }
      })
      .catch((err) => console.log(err))
  }
  const styles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "5px",

      backgroundColor: darkMode ? "white" : "red",
    }),
    option: (provided) => ({
      ...provided,
      backgroundColor: "#3699FF",
      color: darkMode ? "white" : "black",
    }),
  }
  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={600}
      value={search}
      onChange={handleOnChange}
      loadOptions={loadOptions}
      styles={styles}
    />
  )
}

export default Search
