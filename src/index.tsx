/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import "./index.css";
import App from "./App";

const root = document.getElementById("root");

render(
  () => (
    <Router>
      <Route path="/:year?/:month?" component={App} matchFilters={{year: /^\d+$/, month: ['01','02','03','04','05','06','07','08','09','10','11','12']}} />
    </Router>
  ),
  root!
);
