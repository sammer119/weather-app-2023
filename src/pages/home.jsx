import React, { useEffect, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { Preferences } from "@capacitor/preferences";
import {
  Page,
  Navbar,
  NavTitle,
  NavTitleLarge,
  Block,
  List,
  Button,
  ListInput,
  Icon,
  Card,
  f7,
} from "framework7-react";
import {
  BsFillCloudFill,
  BsFillCloudRainFill,
  BsSunFill,
} from "react-icons/bs";
import styles from "../css/app.css?inline";
// import DynamicRoutePage from "./dynamic-route";

// api key and baseURL
const api = {
  key: "48ebc2f4f28e1516f3879dcbcdc3e48c",
  baseURL: "https://api.openweathermap.org/data/2.5/",
};

// Your task is to build an oine-rst cross-plaorm mobile applicaon that can fetch current weather informaon and forecast for the next ve days for any given city using an open weather API. The app should provide an interacve and intuive user interface and remember previous searches for quick future access. You will use Framework7 for the UI, Ionic Capacitor for running the app, Capacitor plugins for enhancing the applicaon funconality, and SQLite for local data storage

const HomePage = () => {
  // state for app
  const [search, setSearch] = useState("");
  const [currentWeather, setCurrentWeather] = useState();
  const [forecastWeather, setForecastWeather] = useState([]);
  const [geoLocation, setGeoLocation] = useState();

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // on load, getLocation of user
  useEffect(() => {
    getLocalStorage();
    openConfirm();
  }, []);

  useEffect(() => {
    if (currentWeather !== undefined && forecastWeather !== undefined) {
      setLocalStorage();
    }
  }, [currentWeather, forecastWeather]);

  // setting local storage when state changes
  useEffect(() => {}, [currentWeather, forecastWeather]);

  // when geolocation has loaded into state then get the weather
  useEffect(() => {
    searchWeatherGeoLocation();
  }, [geoLocation]);

  // getting users current geolocation using Geolocation capacitor
  const getLocation = async () => {
    const coordinates = await Geolocation.getCurrentPosition();
    setGeoLocation(coordinates);
  };

  // search - request to openweather api
  const searchWeather = async () => {
    try {
      if (search !== "") {
        await fetch(
          `${api.baseURL}weather?q=${search}&units=metric&&APPID=${api.key}`
        )
          .then((res) => res.json())
          .then((data) => {
            setCurrentWeather(data);
          });
      }
    } catch (err) {
      console.log(err);
    }

    try {
      if (search !== "") {
        await fetch(
          `${api.baseURL}forecast?q=${search}&units=metric&&APPID=${api.key}`
        )
          .then((res) => res.json())
          .then((data) => {
            let filteredWeather = data.list.filter((x) =>
              x.dt_txt.includes("12:00")
            );
            setForecastWeather(filteredWeather);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const searchWeatherGeoLocation = async () => {
    try {
      if (geoLocation !== undefined) {
        await fetch(
          `${api.baseURL}weather?lat=${geoLocation.coords.latitude}&lon=${geoLocation.coords.longitude}&units=metric&&APPID=${api.key}`
        )
          .then((res) => res.json())
          .then((data) => {
            setCurrentWeather(data);
          });
      }
    } catch (err) {
      console.log(err);
    }

    try {
      if (geoLocation !== undefined) {
        await fetch(
          `${api.baseURL}forecast?lat=${geoLocation.coords.latitude}&lon=${geoLocation.coords.longitude}&units=metric&&APPID=${api.key}`
        )
          .then((res) => res.json())
          .then((data) => {
            let filteredWeather = data.list.filter((x) =>
              x.dt_txt.includes("12:00")
            );
            setForecastWeather(filteredWeather);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const openConfirm = () => {
    f7.dialog.confirm(
      "Use current location to get weather where you are?",
      () => {
        getLocation();
      }
    );
  };

  const setLocalStorage = async () => {
    await Preferences.set({
      key: "currentWeatherMain",
      value: currentWeather.weather[0].main,
    });
    await Preferences.set({
      key: "currentWeatherTemp",
      value: currentWeather.main.temp,
    });
    await Preferences.set({
      key: "currentWeatherHumidity",
      value: currentWeather.main.humidity,
    });
    await Preferences.set({
      key: "currentWeatherName",
      value: currentWeather.name,
    });
  };

  const getLocalStorage = async () => {
    const { value: currentWeatherMain } = await Preferences.get({
      key: "currentWeatherMain",
    });
    const { value: currentWeatherTemp } = await Preferences.get({
      key: "currentWeatherTemp",
    });
    const { value: currentWeatherHumidity } = await Preferences.get({
      key: "currentWeatherHumidity",
    });
    const { value: currentWeatherName } = await Preferences.get({
      key: "currentWeatherName",
    });

    setCurrentWeather({
      weather: [{ main: currentWeatherMain }],
      name: currentWeatherName,
      main: { temp: currentWeatherTemp, humidity: currentWeatherHumidity },
    });
  };

  const forecastElements = forecastWeather.map((x) => (
    <div key={x.dt} className="forecastWeather__Element">
      <p className="currentWeather_Text semibold">
        {weekday[new Date(x.dt_txt).getDay()]}
      </p>
      {/* react-icons depending on what the weather is */}
      {x.weather[0].main === "Clouds" && (
        <BsFillCloudFill size={"45px"} color="lightgray" />
      )}
      {x.weather[0].main === "Rain" && (
        <BsFillCloudRainFill size={"45px"} color="lightgray" />
      )}
      {x.weather[0].main === "Clear" && (
        <BsSunFill size={"45px"} color="#FDE075" />
      )}

      <p className="currentWeather_Text">
        {x.weather[0].main === "Clouds" ? "Cloudy" : x.weather[0].main}
      </p>
      <p className="currentWeather_Text">
        {`${Math.round(x.main.temp_max)} / ${Math.round(x.main.temp_min)}`}°C
      </p>
    </div>
  ));

  console.log(forecastWeather);

  return (
    <Page name="home">
      {/* Top Navbar */}
      <Navbar large sliding={false}>
        <NavTitle sliding>Weather App</NavTitle>

        <NavTitleLarge>Weather App</NavTitleLarge>
      </Navbar>

      {/* Page content */}
      <List strongIos dividersIos insetIos>
        <ListInput
          label="Enter a town or city"
          type="text"
          placeholder="Search..."
          clearButton
          onChange={(e) => setSearch(e.target.value)}
        >
          <Icon icon="demo-list-icon" slot="media" />
        </ListInput>
      </List>
      <Block>
        <Button fill onClick={searchWeather}>
          Search
        </Button>
      </Block>
      <Card className="currentWeather__Card">
        {currentWeather !== undefined && (
          <div className="currentWeather__SectionSeperated">
            <div className="currentWeather__Items">
              <h2 className="currentWeather_Text">{currentWeather.name}</h2>
              <div className="currentWeather__SubItems">
                <h3 className="currentWeather_Text">
                  {Math.round(currentWeather.main.temp)}°C
                </h3>
                <p className="currentWeather_Text">
                  {currentWeather.weather[0].main === "Clouds"
                    ? "Cloudy"
                    : currentWeather.weather[0].main}
                </p>
                <p className="currentWeather_Text">
                  {currentWeather.main.humidity}% Humidity
                </p>
              </div>
            </div>
            <div>
              {currentWeather.weather[0].main === "Clouds" && (
                <BsFillCloudFill size={"110px"} color="lightgray" />
              )}
              {currentWeather.weather[0].main === "Rain" && (
                <BsFillCloudRainFill size={"110px"} color="lightgray" />
              )}
              {currentWeather.weather[0].main === "Clear" && (
                <BsSunFill size={"110px"} color="#FDE075" />
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Temp High, Temp Low and Brief Description */}
      <Card className="forecastWeather__Card">
        <div className="forecastWeather__Section">
          {forecastWeather !== undefined && forecastElements}
        </div>
      </Card>
    </Page>
  );
};
export default HomePage;
