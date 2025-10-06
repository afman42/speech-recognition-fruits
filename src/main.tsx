import "regenerator-runtime"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import "normalize.css"
import { ERROR_MESSAGES } from "./constants"

const rootElement = document.getElementById("root")

if (!rootElement) {
  throw new Error(ERROR_MESSAGES['root-not-found'])
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
