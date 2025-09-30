import React from "react";
import "./App.css";

//components

import InputEntry from "./components/InputEntry";
import ListEntries from "./components/ListEntries";

function App() {
  return (
    <>
      <div className="container">
        <InputEntry />
        <ListEntries />
      </div>
    </>
  );
}

export default App;
