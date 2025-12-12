import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { setupGlobalErrorHandler } from "./services/errorLogger";
import "./styles/tailwind.css";
import "./styles/index.css";
import "./firebaseConfig.js";

// ✅ PHASE 1: Setup global error handler
setupGlobalErrorHandler();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
