import React, { useState, useEffect } from 'react';

export const withBackgroundImages = (Wrapped) => (props) => {
  const { gameModel } = props;
  const [backgroundImages, setBackgroundImages] = useState([]);

  function updateBackgroundImages({ backgroundImages: newBackgroundImages }) {
    setBackgroundImages(newBackgroundImages);
  }

  useEffect(() => {
    gameModel.on('backgroundImagesChanged', updateBackgroundImages);
    updateBackgroundImages({
      backgroundImages: gameModel.get('backgroundImages'),
    });

    return () => {
      gameModel.off('backgroundImagesChanged', updateBackgroundImages);
    };
  }, [gameModel]);

  return <Wrapped {...props} backgroundImages={backgroundImages} />;
};
