import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { initializeERP } from "./initialization/initializeERP";

// Centralized ERP Initialization Engine (Storage Setup, First-Load Seeding, Schema Migrations, Diagnostics)
initializeERP();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

