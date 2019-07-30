import React, { Component } from 'react';
import './ErrorBoundry.css';

export default class ErrorBoundry extends Component {
  state = {
    hasError: false
  };

  componentDidCatch = () => {
    this.setState({
      hasError: true
    });
  }

  render() {
    if (this.state.hasError) {
      localStorage.removeItem('AR_POC');
      setTimeout(() => window.location.reload(), 5000);
      return <div> Got error, reloading page in 5 seconds</div>;
    }
    return this.props.children;
  }
}
