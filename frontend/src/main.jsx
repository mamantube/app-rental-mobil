import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Store from "./store/index.js";
import { Provider} from "react-redux";
import "./assets/CSS/Global.css"


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={Store} >
      <App />
    </Provider>
  </React.StrictMode>,
)
