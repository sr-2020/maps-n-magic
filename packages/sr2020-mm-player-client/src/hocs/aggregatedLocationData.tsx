import React, { useEffect, useState } from "react";
import { LoginState } from "../types";
import { LoginManager } from "../utils";
import { AggregatedLocationView } from "sr2020-mm-event-engine";

export interface WithAggregatedLocationData {
  locationData: AggregatedLocationView | null;
}

let es: EventSource | undefined = undefined;

function createEventSource(setData: React.Dispatch<React.SetStateAction<AggregatedLocationView | null>>) {
  // es = new EventSource('http://localhost:3002/singlePlayerDataSse', {
  es = new EventSource('/api/singlePlayerDataSse', {
    withCredentials: true
  });
  es.addEventListener('message', function (e) {
    try {
      const parsedData = JSON.parse(e.data);
      setData(parsedData);
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

  const [data, setData] = useState<AggregatedLocationView | null>(null);

  useEffect(() => {
    const loginState = loginManager.getLoginState();

    if (loginState.status === 'userLogged') {
      createEventSource(setData);
    }

    function update(loginState: LoginState) {
      if (loginState.status === 'userLogged' && es === undefined) {
        createEventSource(setData);
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

  return <Wrapped {...props} locationData={data} />;
};