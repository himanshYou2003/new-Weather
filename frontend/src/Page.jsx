/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Clock from "./Clock"; // Import the Clock component


function Page() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default coordinates (London)
  const [error, setError] = useState("");
  const [playingSound, setPlayingSound] = useState(null);

  // Refs for audio elements
  const cloudSoundRef = useRef(null);
  const rainSoundRef = useRef(null);
  const snowSoundRef = useRef(null);
  const sunnySoundRef = useRef(null);

  // Fetch weather by city
  const fetchWeather = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/weather", {
        params: { city },
      });
      setWeather(response.data);
      setMapCenter([
        response.data.city.coord.lat,
        response.data.city.coord.lon,
      ]);
      setError("");
    } catch (err) {
      setError("Could not fetch weather data");
      setWeather(null);
    }
  };

  // Fetch weather by location
  const fetchWeatherByLocation = async (lat, lon) => {
    try {
      const response = await axios.get("http://localhost:3000/api/weather", {
        params: { lat, lon },
      });
      setWeather(response.data);
      setMapCenter([lat, lon]);
      setError("");
    } catch (err) {
      setError("Could not fetch weather data");
      setWeather(null);
    }
  };

  // Automatically fetch weather for the user's location on page load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeatherByLocation(lat, lon);
        },
        (error) => {
          setError("Failed to get your location");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }
  }, []);

  // Map weather condition codes to SVG icons
  const weatherIcons = {
    clear: "/icons/sunny.svg",
    rain: "/icons/rainy.svg",
    snow: "/icons/snowy.svg",
    clouds: "/icons/cloudy.svg",
    default: "/icons/default.svg",
  };

  // Get the appropriate icon based on weather condition
  const getWeatherIcon = (condition) => {
    return weatherIcons[condition] || weatherIcons["default"];
  };

  // Helper function to format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  // Aggregate weather data for the 5-day forecast
  const getFiveDayForecast = (list) => {
    const forecast = [];
    let currentDay = new Date().toISOString().split("T")[0];
    for (let i = 0; i < list.length; i++) {
      const forecastDate = new Date(list[i].dt * 1000)
        .toISOString()
        .split("T")[0];
      if (forecastDate !== currentDay) {
        forecast.push(list[i]);
        currentDay = forecastDate;
        if (forecast.length === 5) break;
      }
    }
    return forecast;
  };

  // Handle click events for sounds
  const handleClick = (soundRef) => {
    // Pause the currently playing sound
    if (playingSound && playingSound.current !== soundRef.current) {
      playingSound.current.pause();
      playingSound.current.currentTime = 0; // Reset playback position
    }

    // Play or pause the clicked sound
    if (soundRef.current.paused) {
      soundRef.current.play();
      setPlayingSound(soundRef);
    } else {
      soundRef.current.pause();
      soundRef.current.currentTime = 0; // Reset playback position
      setPlayingSound(null);
    }
  };

  return (
    <div className="w-screen h-screen relative">
      {/* Background Image */}
      <video
        className="absolute inset-0 object-cover w-full h-full"
        src="/bg.mp4"
        autoPlay
        loop
        muted
      />
        {/* Blur Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-lg"></div>

        <div className="w-screen h-screen flex flex-col items-center justify-center relative z-10">
          {/* Search Input and Buttons */}
          <div className="absolute top-5 left-5 flex items-center z-20">
            <input
              type="text"
              className="px-4 py-2 border-2 text-yellow-200 uppercase tracking-wide border-white rounded-lg focus:outline-none focus:ring focus:ring-blue-200 bg-transparent text-white placeholder-white"
              placeholder="Search city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button
              onClick={fetchWeather}
              className="ml-4 px-4 py-2 bg-blue-400 text-gray-800 text-xl font-semibold rounded-lg hover:bg-blue-200 transition"
            >
              Search
            </button>
            <button
              onClick={() =>
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    fetchWeatherByLocation(
                      position.coords.latitude,
                      position.coords.longitude
                    );
                  },
                  (error) => {
                    setError("Failed to get your location");
                  }
                )
              }
              className="ml-4 px-4 py-2 bg-blue-400 text-gray-800 text-xl font-semibold rounded-lg hover:bg-blue-200 transition"
            >
              Current Location
            </button>
          </div>

          {/* Display weather details */}
          {weather && (
            <div className="text-white text-center z-20">
              <h1 className="text-6xl font-bold text-gray-200 font-General">
                {weather.city.name}
              </h1>
              <p className="text-9xl font-light font-Author">
                {weather.list[0].main.temp}°C
              </p>
              <p className="text-2xl mb-8 text-gray-200">
                {weather.list[0].weather[0].description}
              </p>
              {/* Weather Icon */}
              <img
                src={getWeatherIcon(
                  weather.list[0].weather[0].main.toLowerCase()
                )}
                alt={weather.list[0].weather[0].description}
                className="w-28 h-28 cursor-pointer"
                onClick={() =>
                  handleClick(
                    weather.list[0].weather[0].main.toLowerCase() === "clouds"
                      ? cloudSoundRef
                      : weather.list[0].weather[0].main.toLowerCase() === "rain"
                      ? rainSoundRef
                      : weather.list[0].weather[0].main.toLowerCase() === "snow"
                      ? snowSoundRef
                      : sunnySoundRef
                  )
                }
              />
              {/* Additional Functionalities */}
              <div className="grid grid-cols-5 gap-4 w-full mt-8">
                <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
                  <h3 className="font-semibold text-2xl text-gray-700 mb-7">
                    Wind Speed
                  </h3>
                  <p className="text-2xl">{weather.list[0].wind.speed} m/s</p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
                  <h3 className="font-semibold text-2xl text-gray-700 mb-7">
                    Humidity
                  </h3>
                  <p className="text-2xl">{weather.list[0].main.humidity}%</p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
                  <h3 className="font-semibold text-2xl text-gray-700 mb-7">
                    Pressure
                  </h3>
                  <p className="text-2xl">
                    {weather.list[0].main.pressure} hPa
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
                  <h3 className="font-semibold text-2xl text-gray-700 mb-7">
                    Visibility
                  </h3>
                  <p className="text-2xl">
                    {weather.list[0].visibility / 1000} km
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
                  <h3 className="font-semibold text-2xl text-gray-700 mb-7">
                    Cloud Cover
                  </h3>
                  <p className="text-2xl">{weather.list[0].clouds.all}%</p>
                </div>
              </div>

              {/* 5-Day Forecast */}
              {weather.list.length > 0 && (
                <div className="mt-8">
                  <div className="flex space-x-4 overflow-x-auto">
                    {getFiveDayForecast(weather.list).map((day) => (
                      <div
                        key={day.dt}
                        className="bg-white bg-opacity-20 p-4 rounded-lg text-center h-[13vw] w-[9vw]"
                      >
                        <h3 className="font-semibold text-2xl text-gray-700 mb-7">
                          {formatDate(day.dt)}
                        </h3>
                        <p className="text-4xl font-bold mb-6">
                          {day.main.temp}°C
                        </p>
                        <p className="text-xl mb-3 font-normal text-gray-200">
                          {day.weather[0].description}
                        </p>

                        <img
                          src={getWeatherIcon(
                            day.weather[0].main.toLowerCase()
                          )}
                          alt={day.weather[0].description}
                          className="w-16 h-16 mb-2 m-auto cursor-pointer"
                          onClick={() =>
                            handleClick(
                              day.weather[0].main.toLowerCase() === "clouds"
                                ? cloudSoundRef
                                : day.weather[0].main.toLowerCase() === "rain"
                                ? rainSoundRef
                                : day.weather[0].main.toLowerCase() === "snow"
                                ? snowSoundRef
                                : sunnySoundRef
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Display error */}
          {error && (
            <p className="text-red-500 text-lg font-semibold absolute bottom-5 z-20">
              {error}
            </p>
          )}

          {/* Map */}
          <div className="absolute bottom-5 right-5 w-1/5 h-1/3 z-10 border rounded-md">
            <MapContainer
              center={mapCenter}
              zoom={10}
              style={{ height: "100%", width: "100%" }}
              key={mapCenter.toString()} // Forces re-render when mapCenter changes
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={mapCenter}>
                <Popup>You are here</Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Clock */}
          <div className="absolute top-5 right-5 z-20">
            <Clock />
          </div>

          {/* Audio Elements */}
          <audio
            ref={cloudSoundRef}
            src="/CloudSound.mp3"
            preload="auto"
          ></audio>
          <audio ref={rainSoundRef} src="/RainSound.mp3" preload="auto"></audio>
          <audio ref={snowSoundRef} src="/SnowRain.mp3" preload="auto"></audio>
          <audio
            ref={sunnySoundRef}
            src="/SummerSound.mp3"
            preload="auto"
          ></audio>
        </div>
      </div>
  );
}
export default Page;