import React from 'react';
import axios from 'axios';
import Loading from './Loading';
import { formatDate } from '../helpers';

class Weather extends React.Component {
  constructor() {
    super();
    this.state = {
      weather: [],
      loading: true,
      city: `q=Sofia`
    };
    this.fullfillData = this.fullfillData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
  }

  /**
    Getting the user geo location
    @method getLocation
    @public
  */
  getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        this.setState({
          search: `lat=${Math.round(latitude)}&lon=${Math.round(longitude)}`
        });

        this.fullfillData();
      }
    );
  }

  /**
    Toggling element class
    @method toggleDetails
    @param {string} el
    @public
  */
  toggleDetails = (el) => {
    el.currentTarget.classList.toggle('active');
  }

  /**
    Handling city input value change
    @method handleChange
    @param {string} el
    @public
  */
  handleChange = (el) => {
    this.setState({ search: `q=${el.target.value}` });
  }

  /**
    Inserting forecast data into the page
    @method fullfillData
    @public
  */
  fullfillData = () => {
    if(this.refs.searchCity) {
      this.refs.searchCity.value = '';
    }
    const location = this.state.search || 'q=Sofia';

    axios.get(`http://api.openweathermap.org/data/2.5/forecast?${location}&units=metric&APPID=85b5d80eed0d3a7094aeb51645eb260e`)
    .then(res => {
      if(res.status === 200) {
        const city = res.data.city.name;
        const weatherDay0 = res.data.list.filter(element => element.dt_txt.split(' ')[0] === formatDate(new Date()));
        const weatherDay1 = res.data.list.filter(element => element.dt_txt.split(' ')[0] === formatDate(new Date(new Date().getTime()+(24*60*60*1000))));
        const weatherDay2 = res.data.list.filter(element => element.dt_txt.split(' ')[0] === formatDate(new Date(new Date().getTime()+(2*24*60*60*1000))));
        const weatherDay3 = res.data.list.filter(element => element.dt_txt.split(' ')[0] === formatDate(new Date(new Date().getTime()+(3*24*60*60*1000))));
        const weatherDay4 = res.data.list.filter(element => element.dt_txt.split(' ')[0] === formatDate(new Date(new Date().getTime()+(4*24*60*60*1000))));
        const weatherDay5 = res.data.list.filter(element => element.dt_txt.split(' ')[0] === formatDate(new Date(new Date().getTime()+(5*24*60*60*1000))));

        this.setState({
          weather: {
            days: [
              weatherDay0,
              weatherDay1,
              weatherDay2,
              weatherDay3,
              weatherDay4,
              weatherDay5,
            ]
          },
          city,
          loading: false
        });
      }
    })
    .catch(error => {
      console.log(error.response)
    });
  };

  componentDidMount() {
    this.fullfillData();
  }

  render() {
    const loading = this.state.loading;

    return (
      <div>
        {!loading ? (
          <div>
            <h4>Current location: {this.state.city}</h4>
            <div onClick={this.getLocation} className="location-selector"></div>
            <input type="text" id="city-input" className="city-input" ref="searchCity" placeholder="Search city" onChange={this.handleChange} />
            <button onClick={this.fullfillData} className="city-button">Search</button>
            <div className="weather-table">
              {this.state.weather.days.map(function(item, i){
                return (
                  <div key={i} className="weather-day clearfix">
                    <div className="weather-day-title">{item[0].dt_txt.split(' ')[0]}</div>
                    {item.map(function(el,i){
                      return (
                        <div key={i} className={"clearfix  weather-hour " + el.weather[0].main}>
                          <div className="weather-time">{el.dt_txt.split(' ')[1].split(':')[0] + ':' + el.dt_txt.split(' ')[1].split(':')[1]}</div>
                          <div className="weather-temperature">{parseInt(el.main.temp)}°C</div>
                          <div className="weather-details-toggler" onClick={this.toggleDetails}>View more</div>
                          <div className="weather-details">
                            <div className="weather-humidity">{el.main.humidity}%</div>
                            <div className="weather-temp-max">{el.main.temp_max}°C</div>
                            <div className="weather-temp-min">{el.main.temp_min}°C</div>
                            <div className="weather-wind-speed">{el.wind.speed}km/h</div>
                          </div>
                        </div>
                      )
                    }, this)}
                  </div>
                )
              }, this)}
            </div>
          </div>
          ) : (
            <Loading />
          )
        }
      </div>
    );
  }
}

export default Weather;
