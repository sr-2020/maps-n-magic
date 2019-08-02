import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MapMarker.css';

export default class MapMarker extends Component {
  state = {
  };

  render() {
    const {
      x, y, id, color, onClick
    } = this.props;

    return (
      <g
        transform={`translate(${x - 40 / 4},${y - 70 / 2}) scale(0.5)`}
        onClick={onClick}
      >
        <svg
          version="1.1"
          baseProfile="full"
          width="40"
          height="70"
          viewBox="0 0 40 70"
          xmlns="http://www.w3.org/2000/svg"
        >

          <circle
            cx="20"
            cy="20"
            r="18.75"
            strokeWidth="2.5"
            stroke={color || 'black'}
            fill="white"
          />

          <text x="20" y="25" fontSize="15" textAnchor="middle" fill="black">{id}</text>

          <path d="M 1.75 28 L 20 70 L 38.25 28 A 20 20 0 0 1 1.75 28" fill={color} />

        </svg>

      </g>
    );
  }
}

MapMarker.propTypes = {
  // bla: PropTypes.string,
};

MapMarker.defaultProps = {
  // bla: 'test',
};
