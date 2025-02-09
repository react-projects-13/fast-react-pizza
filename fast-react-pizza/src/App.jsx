"use client";
import { createBrowserRouter } from "react-router-dom";
import "./App.css";

import Home from "./ui/Home";
import Menu from "./features/menu/Menu";

createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/menu",
    element: <Menu />,
  },
]);
function App() {
  return <h1>Hello World</h1>;
}

export default App;
