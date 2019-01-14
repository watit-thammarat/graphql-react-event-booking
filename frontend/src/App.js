import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import './App.css';
import Auth from './pages/Auth';
import Bookings from './pages/Bookings';
import Events from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token, userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    const { token, userId } = this.state;
    return (
      <BrowserRouter>
        <Fragment>
          <AuthContext.Provider
            value={{
              token: token,
              userId: userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {!token && <Redirect exact from="/" to="/auth" />}
                {token && <Redirect exact from="/" to="/events" />}
                {token && <Redirect exact from="/auth" to="/events" />}
                {!token && <Route exact path="/auth" component={Auth} />}
                <Route exact path="/events" component={Events} />
                {token && <Route exact path="/bookings" component={Bookings} />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
