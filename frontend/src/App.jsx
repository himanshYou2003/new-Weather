// App.jsx

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Page from "./Page";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page />} />
      </Routes>
    </Router>
  );
};

export default App;
