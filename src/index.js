import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";

import {PersistGate} from "redux-persist/integration/react";
import {persistStore} from "redux-persist";

import store from "./redux/config/configStore";
import {Provider} from "react-redux";

let persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));
window.addEventListener("DOMContentLoaded", function () {
  const hash = window.location.hash;
  if (hash !== "") {
    window.location.replace("");
  }
});
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
