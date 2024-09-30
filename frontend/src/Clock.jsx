import { useState, useEffect } from 'react';

function Clock({ location }) {
  const [time, setTime] = useState(new Date());
  const [timezone, setTimezone] = useState("local");

  // Function to fetch the timezone based on the location
  const fetchTimezone = async (location) => {
    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v1/worldtime?city=${location}`, 
        {
          headers: { 'X-Api-Key': 'YOUR_API_KEY' }
        }
      );
      const data = await response.json();
      setTimezone(data.timezone);
    } catch (error) {
      console.error("Error fetching time zone:", error);
      setTimezone("local");
    }
  };

  useEffect(() => {
    if (location) {
      fetchTimezone(location);
    }
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get time in specific timezone if provided
  const getTimeString = () => {
    const options = {
      timeZone: timezone !== "local" ? timezone : undefined,
    };
    return time.toLocaleTimeString([], options);
  };

  return (
    <div className="text-white text-xl font-semibold">
      {getTimeString()}
    </div>
  );
}

export default Clock;
