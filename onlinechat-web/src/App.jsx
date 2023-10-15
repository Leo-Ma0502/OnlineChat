import "./App.css";
import { Route, Routes } from "react-router-dom";

import Authentication from "./components/authentication";
import Home from "./components/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" index element={<Home />}></Route>
        <Route path="/auth/:option" element={<Authentication />}></Route>
      </Routes>
    </>
  );
}

export default App;
