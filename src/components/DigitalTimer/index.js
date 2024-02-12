// Write your code here
import {Component} from 'react'

import './index.css'

const DailyItem = props => {
  const {forecastDetails} = props

  const {icon, datetime, feelslikemin, feelslikemax, sunrise, sunset} =
    forecastDetails

  const minTemp = Math.round((feelslikemin - 32) * 0.55, 2)
  const temp = Math.round((feelslikemax - 32) * 0.55, 2)

  const date = new Date(datetime)
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const month = monthNames[date.getMonth()]

  const da = date.getDate()

  const k1 = 'https://assets.ccbp.in/frontend/intermediate-rwd/sunny-img.png'
  const k2 =
    'https://assets.ccbp.in/frontend/intermediate-rwd/partly-cloudy-img.png'
  const k3 =
    'https://assets.ccbp.in/frontend/intermediate-rwd/rain-with-sun-img.png'

  let image = ''

  if (icon === 'clear-day') {
    image = k1
  } else if (icon === 'partly-cloudy-day') {
    image = k2
  } else {
    image = k3
  }

  return (
    <>
      <li className="mini1">
        <p className="ph ml-3">
          {da} {month}
        </p>
        <p className="sun">Sunrise: {sunrise}</p>
        <p className="sun">Sunset: {sunset}</p>
        <img src={image} className="icon" alt="img" />
        <div className="temp">
          <p className="po">
            {temp}
            <sup className="po">o</sup>/
          </p>
          <p className="po1">
            {minTemp}
            <sup className="po1">o</sup>
          </p>
        </div>
        <h1 className="pi">{icon}</h1>
      </li>
    </>
  )
}

const HourItem = props => {
  const {hourDetails} = props
  const {humidity, temp, datetime} = hourDetails
  return (
    <>
      <div className="hour">
        <p className="sun1">hour: {datetime}</p>
        <p className="sun1">
          temp: {temp}
          <sup className="sun1">o</sup>
        </p>
        <p className="sun1">humidity: {humidity}</p>
      </div>
    </>
  )
}

class WeatherDashboard extends Component {
  state = {
    temp: '',
    searchInput: '',
    location: '',
    mainImg: '',
    condition: '',
    searchedData: '',
    forecast: [],
    windSpeed: 0,
    windDirection: '',
    humidit: 0,
    srise: '',
    sset: '',
    hour: [],
  }

  componentDidMount() {
    this.getBlogItemData()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  getBlogItemData = async () => {
    this.setState({searchInput: ''})
    const re = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/hyderabad?unitGroup=us&key=3BHQ74CEVSVY3MJMWHJJG7HFM&contentType=json`,
    )
    const r = await re.json()

    this.setState({forecast: r.days.slice(1, 8)})
    const {sunrise, sunset, hours} = r.days[0]

    this.setState({hour: hours})
    this.setState({srise: sunrise})
    this.setState({sset: sunset})

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=2cab70eda4434e46b0165459240402&q=hyderabad&aqi=yes`,
    )

    const data = await response.json()

    this.setState({searchedData: data})

    this.updateData()
  }

  getAnyData = async () => {
    const {searchInput} = this.state

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=2cab70eda4434e46b0165459240402&q=${searchInput}&aqi=yes`,
    )

    const re = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchInput}?unitGroup=us&key=3BHQ74CEVSVY3MJMWHJJG7HFM&contentType=json`,
    )
    if (response.ok === true && re.ok === true) {
      const r = await re.json()
      this.setState({forecast: r.days.slice(1, 8)})
      const {hours} = r.days[0]
      this.setState({hour: hours})
      const data = await response.json()
      this.setState({searchedData: data})

      this.updateData()
    } else {
      this.fake()
    }
  }

  fake = () => {
    alert('wrong input')
    this.setState({searchInput: ''})
  }

  updateData = () => {
    const {searchedData} = this.state

    const currentTemp = searchedData.current.temp_c
    this.setState({temp: currentTemp})

    const loc = searchedData.location.name
    this.setState({location: loc})

    const cond = searchedData.current.condition.text
    const img1 = searchedData.current.condition.icon
    this.setState({mainImg: img1})
    this.setState({condition: cond})

    this.setState({humidit: searchedData.current.humidity})
    this.setState({windDirection: searchedData.current.wind_dir})
    this.setState({windSpeed: searchedData.current.wind_kph})
  }

  keyDown = event => {
    if (event.key === 'Enter') {
      this.getAnyData()
    }
  }

  render() {
    const {
      temp,
      searchInput,
      location,
      mainImg,
      condition,
      forecast,
      windSpeed,
      windDirection,
      humidit,
      sset,
      srise,
      hour,
    } = this.state

    return (
      <div className="bg1">
        <h1>Weather Dashboard</h1>

        <div className="search-input-container">
          <input
            type="search"
            placeholder="Search"
            className="search-input"
            value={searchInput}
            onChange={this.onChangeSearchInput}
            onKeyDown={this.keyDown}
            onClick={this.empty}
          />
          <img
            src="https://assets.ccbp.in/frontend/react-js/app-store/app-store-search-img.png"
            alt="search icon"
            className="search-icon"
            onClick={this.getAnyData}
          />
        </div>
        <button className="home" type="button" onClick={this.getBlogItemData}>
          home
        </button>
        <div className="upper">
          <h1 className="h1">{location}</h1>
          <p className="p p1">
            {temp} <sup className="p p1">o</sup>
          </p>
          <p className="p p2">{condition}</p>
          <p className="p p3">humidity: {humidit}</p>
          <p className="p p5">wind speed: {windSpeed}</p>
          <p className="p p5">wind direction: {windDirection}</p>
          <p className="p p4">wind speed: {windSpeed}</p>
          <p className="p p3">wind direction: {windDirection}</p>
          <p className="p p2">Sunrise: {srise}</p>
          <p className="p p1">Sunset: {sset}</p>
          <img src={mainImg} className="img" alt="img" />
        </div>
        <h1 clsssName="head2">Daily Forecast</h1>
        <ul className="bg2">
          {forecast.map(day => (
            <DailyItem key={day.datetime} forecastDetails={day} />
          ))}
        </ul>
        <h1 clsssName="head2">Hourly Forecast</h1>
        <ul className="bg3">
          {hour.map(eachHour => (
            <HourItem key={eachHour.datetime} hourDetails={eachHour} />
          ))}
        </ul>
      </div>
    )
  }
}

export default WeatherDashboard
