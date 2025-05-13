import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { SuffixforDate, windDirectionInText, weatherType } from './weather-utils.js';

class DailyWeatherGraph extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      background: none;
      box-shadow:none;
      position:relative;
      overflow:visible;
      font-family: "Noto Sans JP", "MS Gothic", sans-serif;
      font-size: 1em;
      margin: 5px;
    }
    .title-bar {
      background-image: linear-gradient(to right,rgb(37, 59, 24),rgb(80, 98, 61));  
      color: white;  
      font-weight: bold;
    }
    .today-weather {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1rem;
      padding: 1rem;
    }
    .weather-icon {
      justify-self: center;
    }
    .grid {
      display: flex; 
      flex-wrap: wrap; 
      gap: 8px; 
      margin-top: 12px;
      margin-left:30px;
    }
    .weather-card {
      padding: 1rem;
      background: #f4f4f4;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
    }
    .weather-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      padding: 40px;
    }
    .temp, .temp-range {
      font-size: 1.12rem;
    }
    .window, .window-body, .window * {
      font-family: "MS Gothic", sans-serif !important;
    }
    .window-body {
      font-size: 1.1rem;
    }
    .hourly-modal {
      position: fixed;
      top: 25%; 
      left: 40%;
      background:none;
      padding: 10px;
      margin-top:750px;
      margin-left:175px;
    
      z-index: 10000;
      box-shadow: none;


      
      
      
    }

    /*for the progress bar*/
    @keyframes loadBar {
    0%   { width: 5%; }
    100% { width: 90%; }
  }

  .progress-indicator-bar {
    display: block;
    height: 100%;
    background: #0078d7;
    animation: loadBar 2.0s steps(8, end) forwards;
    width:720px;
  }
  `;

  static properties = {
    showHourly: { type: Boolean },
    selectedDate: { type: Number },
    weatherData: { state: true },
    hourlyData: { state: true },
    progressValue:{type:Number},
  };

  constructor() {
    super();
    this.weatherData = null;
    this.hourlyData = null;
    this.showHourly = false;
    this.selectedDate = null;
    this.progressValue = 0; 
    this.minTimePassed = false;
  }

  firstUpdated() {


    setTimeout(() => {
      this.minTimePassed = true;
      this.requestUpdate();
    }, 2000);


    this.fetchDailyWeather();
    this.fetchHourlyData();
  }

  async fetchDailyWeather() {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=-33.87&longitude=151.21&daily=temperature_2m_mean,windspeed_10m_max,winddirection_10m_dominant,weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_mean,relative_humidity_2m_mean&timezone=auto';
    try {
      const res = await fetch(url);
      const data = await res.json();
      this.weatherData = {
        days: data.daily.time,
        temps: data.daily.temperature_2m_mean,
        wind_speed: data.daily.windspeed_10m_max,
        wind_direction: data.daily.winddirection_10m_dominant,
        weather_code: data.daily.weathercode,
        max_temp: data.daily.temperature_2m_max,
        min_temp: data.daily.temperature_2m_min,
        precipitation_probability: data.daily.precipitation_probability_mean,
        humidity: data.daily.relative_humidity_2m_mean
      };
    } catch (err) {
      console.error('Error fetching daily weather:', err);
    }
  }

  async fetchHourlyData() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=-33.87&longitude=151.21&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,windspeed_10m,winddirection_10m,weathercode&timezone=auto";
    try {
      const res = await fetch(url);
      const json = await res.json();
      this.hourlyData = {
        time: json.hourly.time,
        temp: json.hourly.temperature_2m,
        humidity: json.hourly.relativehumidity_2m,
        rainProb: json.hourly.precipitation_probability,
        windSpeed: json.hourly.windspeed_10m,
        windDir: json.hourly.winddirection_10m,
        weatherCode: json.hourly.weathercode
      };
    } catch (err) {
      console.error('Error fetching hourly weather:', err);
    }
  }

  render() {

    const loadingDone = this.weatherData && this.minTimePassed;

    if (!loadingDone) {
      return html`
        <link rel="stylesheet" href="https://unpkg.com/98.css">
        <p> <strong> Loading. . . </strong> </p>
        <div class="progress-indicator segmented">
          <span class="progress-indicator-bar"></span>
        </div>

      `;
    } 

    const todayDate = SuffixforDate(this.weatherData.days[0]);
    const todayTemp = this.weatherData.temps[0];
    const todayWindDirection = windDirectionInText(this.weatherData.wind_direction[0]);
    const todayWindSpeed = this.weatherData.wind_speed[0];
    const todayWeatherType = weatherType(this.weatherData.weather_code[0]);
    const todayMaxTemp = this.weatherData.max_temp[0];
    const todayMinTemp = this.weatherData.min_temp[0];
    const todayRainChance = this.weatherData.precipitation_probability[0];
    const todayHumidity = this.weatherData.humidity[0];



    return html`


      <link rel="stylesheet" href="https://unpkg.com/98.css">
      <div class="window" style="width: 725px;">
        <div class="title-bar">
          <div class="title-bar-text">Weather - Sydney</div>
          <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close" @click="${this.closeWidget}"></button>
          </div>
        </div>


        <div class="window-body">
          <fieldset class="today-weather">
            <legend>Today's Weather</legend>
            <div>
              <p><strong>${todayDate}</strong></p>
              <p class="temp">Temperature: ${todayTemp}°C</p>
              <p class="temp">(${todayMinTemp}°C to ${todayMaxTemp}°C)</p>
              <p>${todayWeatherType} / 💧 ${todayHumidity}% / 🌧️ ${todayRainChance}%</p>
              <p style="font-size:0.9rem;">Wind: ${todayWindDirection} at ${todayWindSpeed} km/h</p>
            </div>
            <div>
              <img class="weather-icon" src="${this.getWeatherIcon(todayWeatherType)}" alt="${todayWeatherType}" style="width: 70px; height: 70px;" />
            </div>
          </fieldset>







          <div class="grid" >
            ${this.weatherData.days.slice(1, 7).map((day, index) => {
              const dayDate = SuffixforDate(day);
              const temp = this.weatherData.temps[index + 1];
              const weatherTypeText = weatherType(this.weatherData.weather_code[index + 1]);
              const precipChance = this.weatherData.precipitation_probability[index + 1];
              const maxTemp = this.weatherData.max_temp[index + 1];
              const minTemp = this.weatherData.min_temp[index + 1];
              const humidity = this.weatherData.humidity[index + 1];
              return html`
                <div class="window" style="width: 200px;">
                  <div class="title-bar">
                    <div class="title-bar-text">${dayDate}</div>
                    <div class="title-bar-controls">
                      <button aria-label="Maximize" @click=${() => this.showHourlyModal(index + 1)}></button>
                    </div>
                  </div>
                  <div class="window-body">
                    <p><strong>${temp}°C</strong></p>
                    <p>${maxTemp}°C / ${minTemp}°C</p>
                    <p>${weatherTypeText}</p>
                    <p>💧 ${humidity}% / 🌧️ ${precipChance}%</p>
                  </div>
                </div>
              `;
            })}
          </div>



        <!-- Modal for hourly data -->

        ${this.showHourly && this.hourlyData ? html`
          <div class="hourly-modal">


            <div class="window" style="width: 400px;">


              <div class="title-bar">
                <div class="title-bar-text" style = "font-size: 0.9rem;">
                  Hourly Forecast - ${SuffixforDate(this.weatherData.days[this.selectedDate])}
                </div>
                <div class="title-bar-controls">
                  <button aria-label="Close" @click=${this.closeHourlyModal}></button>
                </div>
              </div>



              <div class="window-body" style = "width : 330px;">
                <div class="sunken-panel" style="height: 360px;">
                  <table class="interactive">


                    <thead>
                      <tr style = "font-size: 0.867rem;">
                        <th>Time</th>
                        <th>Temperature</th>
                        <th>Humidity</th>
                        <th>Precipitation</th>
                      </tr>
                    </thead>


                    <tbody>
                      ${this.hourlyData.time.map((time, idx) => {
                        const dt = new Date(time);
                        const selDt = new Date(this.weatherData.days[this.selectedDate]);
                        const sameDay = dt.getDate() === selDt.getDate() && dt.getMonth() === selDt.getMonth();
                        if (sameDay){return html`
                          <tr style = "font-size: 0.867rem; ">
                            <td>${dt.getHours()}:00</td>
                            <td><strong>${this.hourlyData.temp[idx]}°C</strong></td>
                            <td>${this.hourlyData.humidity[idx]} %</td>
                            <td>${this.hourlyData.rainProb[idx]} %</td>
                          </tr>
                        ` } return "";
                      })}
                    </tbody>

                    
                  </table>
                </div>
              </div>
            </div>
          </div>
        ` : ''}
      `;
    }

  getWeatherIcon(weatherType) {
  switch (weatherType) {
    case 'Clear sky': return 'src/components/weather/clear-day.png';
    case 'Mainly clear': return 'src/components/weather/mostly-clear-day.png';
    case 'Partly cloudy': return 'src/components/weather/mostly-cloudy-day.png';
    case 'Cloudy': return 'src/components/weather/cloudy.png';
    case 'Fog': return 'src/components/weather/cloudy.png'; // Reused icon
    case 'Depositing rime fog': return 'src/components/weather/cloudy.png';
    case 'Light drizzle': return 'src/components/weather/showers.png';
    case 'Moderate drizzle': return 'src/components/weather/showers.png';
    case 'Heavy drizzle': return 'src/components/weather/showers.png';
    case 'Light freezing drizzle': return 'src/components/weather/mix.png';
    case 'Heavy freezing drizzle': return 'src/components/weather/mix.png';
    case 'Light rain': return 'src/components/weather/rain.png';
    case 'Moderate rain': return 'src/components/weather/rain.png';
    case 'Heavy rain': return 'src/components/weather/heavy-rain.png';
    case 'Light freezing rain': return 'src/components/weather/mix.png';
    case 'Heavy freezing rain': return 'src/components/weather/mix.png';
    case 'Light snow': return 'src/components/weather/snow.png';
    case 'Moderate snow': return 'src/components/weather/snow.png';
    case 'Heavy snow': return 'src/components/weather/heavy-snow.png';
    case 'Snow grains': return 'src/components/weather/snow.png';
    case 'Light rain showers': return 'src/components/weather/showers.png';
    case 'Moderate rain showers': return 'src/components/weather/showers.png';
    case 'Heavy rain showers': return 'src/components/weather/heavy-rain.png';
    case 'Light snow showers': return 'src/components/weather/mix.png';
    case 'Heavy snow showers': return 'src/components/weather/mix.png';
    case 'Thunderstorm': return 'src/components/weather/tstorm.png';
    case 'Thunderstorm with light hail': return 'src/components/weather/tstorm.png';
    case 'Thunderstorm with heavy hail': return 'src/components/weather/severe-tstorm.png';
    default: return '❓';
  }
}

  closeWidget() {
    window.location.href = "hub_index.html";
  }

  showHourlyModal(index) {
    this.selectedDate = index;
    this.showHourly = true;
  }

  closeHourlyModal() {
    this.showHourly = false;
  }

  
}

customElements.define('weather-widget2', DailyWeatherGraph);
