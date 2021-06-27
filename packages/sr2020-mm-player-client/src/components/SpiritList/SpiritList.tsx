import React, { useEffect } from 'react';
import './SpiritList.css';
import * as R from 'ramda';
import Button from "react-bootstrap/Button";

import { WithAggregatedLocationData } from '../../hocs';

// import { WithTranslation } from "react-i18next";

interface SpiritListProps extends WithAggregatedLocationData {
  setTitle: (title: string) => void;
}

export function SpiritList(props: SpiritListProps) {
  const { locationData, setTitle } = props;

  
  useEffect(() => {
    setTitle(`Духи (${locationData?.spiritViews.length || 0})`)
  }, [locationData?.spiritViews.length]);
  
  if (!locationData) {
    return (
      <div className="tw-text-center">
        <h2 className="tw-my-16 tw-text-2xl">Локация неизвестна</h2>
      </div>
    );
  }

  const { spiritViews } = locationData;

  if (spiritViews.length === 0) {
    return (
      <div className="tw-text-center">
        <h2 className="tw-my-16 tw-text-2xl">В локации нет духов</h2>
      </div>
    );
  }

  const sortedSpiritViews = R.sortBy((el) => el.name.toLowerCase(), spiritViews);
  
  return (
    <div className="SpiritList">
      {/* <div>
        {JSON.stringify(locationData)}
      </div> */}
      {
        sortedSpiritViews.map(spiritView => 
          <Button 
            variant="outline-primary" 
            className="tw-w-full tw-text-left tw-py-4 tw-mb-2"
          >
            {spiritView.name}
          </Button>
        )
      }
      {/* SpiritList content */}
    </div>
  );
}



