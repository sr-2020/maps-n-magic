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
    this.onFinalChange = this.onFinalChange.bind(this);
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

  onFinalChange(e) {
    const {
      onChange,
    } = this.props;
    const {
      values,
    } = this.state;
    // this.setState({
    //   values: [...e],
    // });
    onChange(values);
  }

  onTimeRangeChange(e) {
    const {
      values,
    } = this.props;
    if (e[1] !== values[1]) {
      const delta = values[1] - values[0];
      this.setState({
        values: [e[1] - delta, e[1]],
      });
    } else if (e[0] !== values[0]) {
      this.setState({
        values: [...e],
      });
    }
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
        onFinalChange={this.onFinalChange}
        max={max}
        min={min}
        step={step}
        tickStep={tickStep}
      />
    );
  }
}
