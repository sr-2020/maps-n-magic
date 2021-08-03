import React, { useEffect, useState } from "react";
import { LoginState } from "../types";
import { LoginManager } from "../utils";

export interface WithLoginState {
  loginState: LoginState;
}

export const withLoginState = (Wrapped: any) => (props: any) => {
  const { loginManager }: {
    loginManager: LoginManager
  } = props;

  const [data, setData] = useState<LoginState>(loginManager.getLoginState());

  useEffect(() => {
    function update(loginState: LoginState) {
      setData(loginState);
    }
    loginManager.on('loginStateChanged', update);
    setData(loginManager.getLoginState());

    return () => {
      loginManager.off('loginStateChanged', update);
    };
  }, [loginManager]);

  return <Wrapped {...props} loginState={data} />;
};