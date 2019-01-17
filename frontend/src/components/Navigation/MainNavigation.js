import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';
import AuthContext from '../../context/auth-context';

const mainNavigation = props => {
  return (
    <AuthContext.Consumer>
      {({ token, logout }) => (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>EasyEvent</h1>
          </div>
          <nav className="main-navigation__items">
            <ul>
              {!token && (
                <li>
                  <NavLink to="/auth">Authenticate</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {token && (
                <Fragment>
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li>
                    <button onClick={logout}>Logout</button>
                  </li>
                </Fragment>
              )}
            </ul>
          </nav>
        </header>
      )}
    </AuthContext.Consumer>
  );
};

export default mainNavigation;
