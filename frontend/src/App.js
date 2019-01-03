import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import './App.css';
import Auth from './pages/Auth';
import Bookings from './pages/Bookings';
import Events from './pages/Events';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Redirect exact from="/" to="/auth" />
          <Route exact path="/auth" component={Auth} />
          <Route exact path="/events" component={Events} />
          <Route exact path="/bookings" component={Bookings} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
