import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import Create from "./components/Create";
import Transfer from "./components/Transfer";
import Redeem from "./components/Redeem";
import Navigation from "./components/Navigation";

function App() {
  return (
    <BrowserRouter>
      <div className="main">
        <Navigation />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} exact />
            <Route path="/create" element={<Create />} exact />
            <Route path="/transfer" element={<Transfer />} exact />
            <Route path="/redeem" element={<Redeem />} exact />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
