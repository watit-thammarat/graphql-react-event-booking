import React, { Component } from 'react';

import './Auth.css';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.state = {
      isLogin: true
    };
  }

  submitHandler = async e => {
    e.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    let body = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };
    if (!this.state.isLogin) {
      body = {
        query: `
        mutation {
          createUser(userInput: { email: "${email}", password: "${password}" }) {
            _id
            email
          }
        }
      `
      };
    }
    try {
      const res = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const statuses = [200, 201];
      if (!statuses.includes(res.status)) {
        throw new Error('Failed');
      }
      const json = await res.json();
      console.log(json);
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input ref={this.emailEl} type="email" id="id" />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input ref={this.passwordEl} type="password" id="password" />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button
            type="button"
            onClick={() => this.setState(prev => ({ isLogin: !prev.isLogin }))}
          >
            Switch to {this.state.isLogin ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    );
  }
}

export default Auth;
