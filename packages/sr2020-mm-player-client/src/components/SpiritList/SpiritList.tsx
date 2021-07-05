import React, { useEffect } from 'react';
import './SpiritList.css';
import * as R from 'ramda';
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";

import { WithAggregatedLocationData } from '../../hocs';

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
      {/* {
        sortedSpiritViews.map(spiritView => 
          <Button 
            variant="outline-primary" 
            className="tw-w-full tw-text-left tw-py-4 tw-mb-2"
          >
            {spiritView.name}
          </Button>
        )
      } */}

      <Accordion 
        // defaultActiveKey="0"
      >
        {
          sortedSpiritViews.map((spiritView, index) => 
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey={String(index)}>
                <div>{spiritView.name}</div>
                <div className="text-muted tw-text-sm">{spiritView.fractionName}</div>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={String(index)}>
                <Card.Body>
                  <div className="tw-mb-4">
                    {'Фракция ' + spiritView.fractionName}
                  </div>
                  <Button 
                    variant="outline-primary" 
                    className="tw-w-full tw-text-left tw-py-4 tw-mb-2"
                  >
                    Поймать
                  </Button>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          )
        }
      </Accordion>
    </div>
  );
}



