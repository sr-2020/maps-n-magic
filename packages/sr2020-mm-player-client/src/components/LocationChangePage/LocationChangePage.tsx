import React, { useEffect } from 'react';
import './LocationChangePage.css';
import { AggregatedLocationView, tmpLocIndex } from "sr2020-mm-event-engine";
import classNames from 'classnames';

import Button from "react-bootstrap/Button";
import { postUserPosition } from '../../api';
import { t } from "../../utils";

interface LocationChangePageProps {
  locationData: AggregatedLocationView | null;
  setTitle: (title: string) => void;
}

export function LocationChangePage(props: LocationChangePageProps) {
  const { locationData, setTitle } = props;

  useEffect(() => {
    setTitle(t('locationChangePage'));
  }, []);

  if (locationData === null) {
    return <div>
      {t('locationDataLoading')}
    </div>
  }

  return (
    <div className="LocationChangePage tw-m-4 tw-flex tw-flex-col">
      {
        tmpLocIndex.map(item => (
          <Button
            variant="outline-primary" 
            className={classNames('tw-mb-4', {
              'tw-bg-blue-700 tw-text-white': item.location_id === locationData.id,
            })}
            onClick={() => postUserPosition(item.location_id)}
          >
            {item.name}
          </Button>
        ))
      }
    </div>
  );
}



