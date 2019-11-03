import React, { Component } from 'react';
import './ErrorBoundry.css';

import { ErrorBoundryPropTypes } from '../../types';

export class ErrorBoundry extends Component {
  static propTypes = ErrorBoundryPropTypes;

  constructor() {
    super();
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch = () => {
    this.setState({
      hasError: true,
    });
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.hasError) {
      localStorage.removeItem('AR_POC');
      setTimeout(() => window.location.reload(), 5000);
      return <div> Got error, reloading page in 5 seconds</div>;
    }
    // eslint-disable-next-line react/destructuring-assignment
    return this.props.children;
  }
}
