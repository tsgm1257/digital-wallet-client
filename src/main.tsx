import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import WalletTourProvider from "./tour/WalletTour";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <WalletTourProvider >
        <App />
      </WalletTourProvider>
    </Provider>
  </React.StrictMode>
);
