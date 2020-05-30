import React, { Component } from 'react';
import './RescueServiceMessageSender.css';

// import { RescueServiceMessageSenderPropTypes } from '../../types';

export class RescueServiceMessageSender extends Component {
  // static propTypes = RescueServiceMessageSenderPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    console.log('RescueServiceMessageSender mounted');
  }

  componentDidUpdate() {
    console.log('RescueServiceMessageSender did update');
  }

  componentWillUnmount() {
    console.log('RescueServiceMessageSender will unmount');
  }

  render() {
    const { something } = this.state;
    // const { t } = this.props;

    if (!something) {
      return <div> RescueServiceMessageSender stub </div>;
      // return null;
    }
    return (
      <div className="RescueServiceMessageSender">
        RescueServiceMessageSender body
      </div>
    );
  }
}
