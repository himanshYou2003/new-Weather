// src/utils.jsx
import sunnyIcon from '/icons/sunny.svg';
import rainyIcon from '/icons/rainy.svg';
import cloudyIcon from '/icons/cloudy.svg';
import snowyIcon from '/icons/snowy.svg';
// Add more imports for different conditions

export const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

export const getWeatherIcon = (condition) => {
  switch (condition) {
    case 'Sunny':
      return sunnyIcon;
    case 'Rainy':
      return rainyIcon;
    case 'Cloudy':
      return cloudyIcon;
    case 'Snowy':
      return snowyIcon;
    default:
      return null; // or a default icon
  }
};
