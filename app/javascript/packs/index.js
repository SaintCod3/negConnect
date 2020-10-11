import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import Popper from "popper.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "../components/login";
import Register from "../components/register";
import Edit_profile from "../components/edit_profile";
import Profile from "../components/profile";
import MapContainer from "../components/map"
import Navegation from "../components/navegation";
import Chat from "../components/chat";
import Messenger from "../components/messenger";

library.add(faChevronLeft);

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <BrowserRouter>
      <Switch>
        <Route exact strict path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/edit_profile" component={Edit_profile} />
        <Route path="/profile" component={Profile} />
        <Route path="/map" component={MapContainer} />
        <Route
          path="/requests/:request_id/messenger"
          exact 
          component={Messenger}
        />
        <Route
          path="/requests/:request_id/conversations/:conversation_id"
          exact
          component={Chat}
        />
      </Switch>
    </BrowserRouter>,
    document.body.appendChild(document.createElement("div"))
  );
});
