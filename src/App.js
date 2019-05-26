import React from "react";
import "./App.css";
import axios from "axios";
import config from "./config.js";
import { WiDayHaze, WiCloud, WiDaySunny, WiDayRain } from "react-icons/wi";
var cities = require("./bd-city.json");
class App extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null
    this.state = {
      weatherData: [],
      isError: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.reset= this.reset.bind(this);
  }

  // save the search value onChange
  handleChange(e) {
    if (e.target.value !== 0) {
      this.setState(
        {
          isError: false
        },
        () => {}
      );
      let response = " ";
      response = new Promise((resolve, reject) => {
        axios
          .get(
            config +
              "current?city=" +
              e.target.value +
              "&country=BD&key=cc41ae1d1c974f3cb029aff199d62a35"
          )
          .then(res => {
            if (res.status !== 204) {
              resolve(res.data.data);
            } else {
              reject(res.statusText);
            }
          })
          .catch(err => {
            reject(err.response);
          });
      });

      response
        .then(response => {
          this.setState(
            {
              weatherData: response
            },
            () => {}
          );
        })
        .catch(err => {
          this.setState(
            {
              isError: true
            },
            () => {}
          );
        });
    }
  }

  componentDidMount() {
    let response = " ";
    //get the current location to see the current places data

    navigator.geolocation.getCurrentPosition(position => {
      response = new Promise((resolve, reject) => {
        axios
          .get(
            config +
              "current?lat=" +
              position.coords.latitude +
              "&lon=" +
              position.coords.longitude +
              "&key=cc41ae1d1c974f3cb029aff199d62a35"
          )
          .then(res => {
            if (res.status !== 204) {
              resolve(res.data.data);
            } else {
              reject(res.statusText);
            }
          })
          .catch(err => {
            reject(err.response);
          });
      });
      response
        .then(response => {
          this.setState(
            {
              weatherData: response
            },
            () => {}
          );
        })
        .catch(err => {
          this.setState(
            {
              isError: true
            },
            () => {}
          );
        });
    });

    // events to check for reseting the timer

    document.addEventListener("mousemove", this.reset, false);
    document.addEventListener("mousedown", this.reset, false);
    document.addEventListener("keypress", this.reset, false);
    document.addEventListener("touchmove", this.reset, false);

    // set the timer, reset timer 5 min
    this.timer = setTimeout(() => {
      window.location.reload();
    }, 300000);
   
  }

  // reseting function for the app
  reset() {
    clearTimeout(this.timer);
    this.timer = null
    this.timer = setTimeout(() => {
      window.location.reload();
    }, 300000);
  }

  render() {
    let cityArray = [];
    let cardContent = [];

    cityArray.push(
      <option value="0" key="0">
        Select A City
      </option>
    );
    cities.districts.forEach((element, i) => {
      cityArray.push(
        <option value={element.name} key={i + 1}>
          {element.name}
        </option>
      );
    });

    //show error if the data is not found
    if (this.state.isError) {
      cardContent.push(
        <div className="card" key="1">
          <div className="card--body">
            {" "}
            <p>Sorry the database has no info about this city</p>
          </div>
        </div>
      );
    } else {
      let cloud = "";
      this.state.weatherData.map((user, i) => {
        // a switch statement for selecting an icon depending on the weather
        switch (user.weather.description) {
          case "Sunny":
            cloud = <WiDaySunny className="card-body__icon" />;
            break;
          case "Rain":
            cloud = <WiDayRain className="card-body__icon" />;
            break;
          case "Haze":
            cloud = <WiDayHaze className="card-body__icon" />;
            break;
          default:
            cloud = <WiCloud className="card-body__icon" />;
            break;
        }

        // push the card with the datas of the weather
        cardContent.push(
          <div className="card" key={i}>
            <div className="card--body">
              {cloud}
              <p className="card-body__temp">{user.temp || 0} °C </p>
              <p>Time Zone: {user.timezone || "N/A"}</p>
              <p>City Name: {user.city_name || "N/A"}</p>
              <p>Description: {user.weather.description} </p>
            </div>
          </div>
        );
      });
    }
    return (
      <div className="App">
        <main>
          {/* input to search for the a city */}
          <select name="dropdown" onChange={this.handleChange}>
            {cityArray}
          </select>

          {/* display box to show the weather condition of the searched city */}
          {cardContent}
        </main>
      </div>
    );
  }
}

export default App;
