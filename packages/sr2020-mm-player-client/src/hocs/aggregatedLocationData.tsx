import React, { useEffect, useState } from "react";
import { LoginState } from "../types";
import { LoginManager } from "../utils";
import { AggregatedLocationView, CharacterModelData2 } from "sr2020-mm-event-engine";

export interface WithLocationDataOnly {
  locationData: AggregatedLocationView | null;
}

export interface WithCharacterDataOnly {
  characterData: CharacterModelData2 | null;
}
export interface WithAggregatedLocationData extends WithLocationDataOnly, WithCharacterDataOnly {
}

let es: EventSource | undefined = undefined;

const url = process.env.NODE_ENV === 'production' 
  ? '/api/singlePlayerDataSse' 
  : 'http://localhost:3002/api/singlePlayerDataSse';

function createEventSource(
  setLocationData: React.Dispatch<React.SetStateAction<AggregatedLocationView | null>>,
  setCharacterData: React.Dispatch<React.SetStateAction<CharacterModelData2 | null>>
) {
  es = new EventSource(url, {
  // es = new EventSource('/api/singlePlayerDataSse', {
    withCredentials: true
  });
  es.addEventListener('message', function (e) {
    try {
      const parsedData = JSON.parse(e.data);
      if (parsedData.spiritViews === undefined) {
        setCharacterData(parsedData);
      } else {
        setLocationData(parsedData);
      }
    } catch(err) {
      console.error(err);
    }
    // console.log(e);
  });
}

function removeEventSource() {
  if (es !== undefined) {
    es.close();
    es = undefined;
  }
}

export const withAggregatedLocationData = (Wrapped: any) => (props: any) => {
  const { loginManager }: {
    loginManager: LoginManager
  } = props;

  const [locationData, setLocationData] = useState<AggregatedLocationView | null>(null);
  const [characterData, setCharacterData] = useState<CharacterModelData2 | null>(null);

  useEffect(() => {
    const loginState = loginManager.getLoginState();

    if (loginState.status === 'userLogged') {
      createEventSource(setLocationData, setCharacterData);
    }

    function update(loginState: LoginState) {
      if (loginState.status === 'userLogged' && es === undefined) {
        createEventSource(setLocationData, setCharacterData);
      } else if (loginState.status !== 'userLogged' && es !== undefined) {
        removeEventSource()
      }
    }
    loginManager.on('loginStateChanged', update);

    return () => {
      loginManager.off('loginStateChanged', update);
      if (es !== undefined) {
        removeEventSource()
      }
    };
  }, [loginManager]);

  return <Wrapped {...props} locationData={locationData} characterData={characterData} />;
};