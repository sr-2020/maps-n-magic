import React, { Component } from 'react';
import './TimeRangeWrapper.css';

import { TimeRange } from '../TimeRange';

// import { TimeRangeWrapperPropTypes } from '../../types';

export class TimeRangeWrapper extends Component {
  // static propTypes = TimeRangeWrapperPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      values: null,
    };
    this.onTimeRangeChange = this.onTimeRangeChange.bind(this);
  }

  componentDidMount() {
    const {
      values,
    } = this.props;
    this.setState({
      values,
    });
    console.log('TimeRangeWrapper mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      values,
    } = this.props;

    if (prevProps.values !== values) {
      this.setState({
        values,
      });
    }
    console.log('TimeRangeWrapper did update');
  }

  componentWillUnmount() {
    console.log('TimeRangeWrapper will unmount');
  }

  onTimeRangeChange(e) {
    this.setState({
      values: [...e],
    });
  }

  render() {
    const {
      onChange, max, min, step, tickStep,
    } = this.props;
    const {
      values,
    } = this.state;
    if (!values) {
      return null;
    }
    return (

      <TimeRange
        values={values}
        onChange={this.onTimeRangeChange}
        onFinalChange={onChange}
        max={max}
        min={min}
        step={step}
        tickStep={tickStep}
      />
    );
  }
}
