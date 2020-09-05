import React from 'react';
import './Map.css';

// import { MapPropTypes } from '../../types';

export function Map(props) {
  const {
    imagePositionX,
    imagePositionY, imageOpacity, imageScale, svgWidth, svgHeight,
    children, onClick, imageUrl,
  } = props;

  const imageStyle = {
    background: `linear-gradient(to bottom,
                    rgba(255,255,255,${imageOpacity / 100}) 0%,
                    rgba(255,255,255,${imageOpacity / 100}) 100%),
                    url(${imageUrl}) no-repeat ${imagePositionX}% ${imagePositionY}% / ${imageScale}px auto`,
    // backgroundSize: `${imageScale}% auto`,
    // backgroundPosition: `${imagePositionX}% ${imagePositionY}%`
  };
  return (
    <svg
      className="root-image margin-2rem"
      width={svgWidth}
      height={svgHeight}
      xmlns="http://www.w3.org/2000/svg"
      style={imageStyle}
      onClick={onClick}
    >
      {children}
    </svg>
  );
}

// Map.propTypes = MapPropTypes;
