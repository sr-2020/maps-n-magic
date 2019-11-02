import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MapPoint.css';

class MapPoint extends Component {
  state = {
  };

  render() {
    const {
      x, y, fill, r = 2
    } = this.props;

    return (
      <circle r={r} cx={x} cy={y} fill={fill || 'red'} />
    );
  }
}

MapPoint.propTypes = {
  // bla: PropTypes.string,
};

MapPoint.defaultProps = {
  // bla: 'test',
};

export { MapPoint };
