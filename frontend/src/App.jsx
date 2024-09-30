// App.jsx

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import Page from "./Page";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Page />} />
      </Routes>
    </Router>
  );
};

export default App;
