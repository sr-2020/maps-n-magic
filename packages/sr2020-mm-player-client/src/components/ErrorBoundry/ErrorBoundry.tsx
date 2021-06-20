import React, { Component } from 'react';
import './ErrorBoundry.css';

// import { ErrorBoundryPropTypes } from '../../types';

interface ErrorBoundryProps {
  children: React.ReactNode;
}
interface ErrorBoundryState {
  hasError: boolean;
}

export class ErrorBoundry extends Component<ErrorBoundryProps, ErrorBoundryState> {
  // static propTypes = ErrorBoundryPropTypes;

  constructor(props: ErrorBoundryProps) {
    super(props);
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
      setTimeout(() => window.location.reload(), 15000);
      return <div> Got error, reloading page in 15 seconds</div>;
    }
    // eslint-disable-next-line react/destructuring-assignment
    return this.props.children;
  }
}