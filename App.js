import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./assets/css/style.css";
import GlobalRoutes from "./GlobalRoutes/GlobalRoutes";

const App = () => {
  return (
    <Router>
      <div className="App">
        <GlobalRoutes />
      </div>
    </Router>
  );
};

export default App;

