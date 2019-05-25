import React from 'react';
import './App.css';
import axios from 'axios'
import config from './config.js'

class App extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        value: "",
        weatherData: "",
        isError: false
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSearch = this.handleSearch.bind(this);
  }

  // save the search value onChange
  handleChange(e) {
    this.setState({ value: e.target.value }, () => {});    
  }

  // function to handle api call of the searched city
  handleSearch = event => {
    let response =" "
     if (event.key === 'Enter') {
      response = new Promise((resolve, reject) => {
       axios.get(config+ "current?city="+ this.state.value +"&country=BD&key=cc41ae1d1c974f3cb029aff199d62a35")
      .then(res => {
        resolve(res.data.data[0])
        }).catch(err => {
          reject(err.response)
        })
      });

      response.then(response => {
        console.log(response);
        this.setState({
          weatherData: response
        })
      }).catch(err => {
        this.setState({
          isError: true
        })
      })

     }
  }
  render(){
    return (
        <div className="App">
          <main>
            {/* input to search for the a city */}
            <input type="text" id="city" name="search_box" placeholder="Type a city name" onKeyDown={this.handleSearch}  onChange={this.handleChange}/>

            {/* display box to show the weather condition of the searched city */}
            {
              this.state.isError != true ?
                 <div className="card">
                  <div className="card--body">
                  <p>City Name: {this.state.weatherData.city_name || "N/A"}</p>
                  <p>Temperature: {this.state.weatherData.temp || 0} °C</p>
                  <p>Time Zone: {this.state.weatherData.timezone || "N/A"}</p>
                  {/* <p>Description: {this.state.weatherData.weather || "N/A"} </p> */}
                  </div>
                </div>
                :
                <div>
                  <p>Sorry that city is not listed in our system</p>
                </div>
              
            }
           

          </main>
        </div>
      );
    }
  
}

export default App;
