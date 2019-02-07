import React, { Component } from 'react';

import './Auth.css';
import AuthContext from '../context/auth-context';

class Auth extends Component {
  static contextType = AuthContext;

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
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: { email, password }
    };
    if (!this.state.isLogin) {
      body = {
        query: `
          mutation CreateUser($email: String!, $password: String!) {
            createUser(userInput: { email: $email, password: $password }) {
              _id
              email
            }
          }
        `,
        variables: { email, password }
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
      if (this.state.isLogin && json.data.login.token) {
        const { token, userId, tokenExpiration } = json.data.login;
        this.context.login(token, userId, tokenExpiration);
      }
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
