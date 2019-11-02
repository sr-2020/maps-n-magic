import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Map.css';

class Map extends Component {
  state = {
  };

  render() {
    const {
      imagePositionX,
      imagePositionY, imageOpacity, imageScale, svgWidth, svgHeight, onPropChange,
      children, onClick, imageUrl
    } = this.props;

    const imageStyle = {
      background: `linear-gradient(to bottom,
                    rgba(255,255,255,${imageOpacity / 100}) 0%,
                    rgba(255,255,255,${imageOpacity / 100}) 100%),
                    url(${imageUrl}) no-repeat ${imagePositionX}% ${imagePositionY}% / ${imageScale}px auto`,
      // backgroundSize: `${imageScale}% auto`,
      // backgroundPosition: `${imagePositionX}% ${imagePositionY}%`
    };
    // {...this.props}
    return (
      <svg
        className="root-image margin-2rem"
        width={svgWidth}
        height={svgHeight}
        xmlns="http://www.w3.org/2000/svg"
        style={imageStyle}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...this.props}
      >
        {/* onClick={onClick} */}
        {children}
      </svg>
    );
  }
}

Map.propTypes = {
  // bla: PropTypes.string,
};

Map.defaultProps = {
  // bla: 'test',
};

export { Map };
