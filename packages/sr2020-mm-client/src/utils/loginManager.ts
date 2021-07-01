import { LoginState } from "../types";
import { EventEmitter } from "events";
import { isLoggedIn } from "../api";
import { validateErrorResponse } from "sr2020-mm-event-engine";

export class LoginManager extends EventEmitter {
  loginState: LoginState = { status:'unknown' };
  updateTimerId: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.updateLoginState = this.updateLoginState.bind(this);
    this.slowUpdateLoginState = this.slowUpdateLoginState.bind(this);
  }

  async slowUpdateLoginState() {
    this.loginState = {
      status: 'loading'
    };
    this.emit('loginStateChanged', this.loginState);
  
    if (this.updateTimerId !== null) {
      clearTimeout(this.updateTimerId);
    }
    this.updateTimerId = setTimeout(() => this.updateLoginState(), 500);
  }

  async updateLoginState(firstLoad: boolean = false) {
    try {
      const res = await isLoggedIn();
      // fetch('/api/isLoggedIn');
      if (res.status === 401 && firstLoad) {
        this.loginState = {
          status: 'userUnlogged'
        };
      } else 
      if (res.status === 200) {
        this.loginState = {
          status: 'userLogged'
        };
      } else {
        const errorResponse: unknown = await res.json();
        if (validateErrorResponse(errorResponse)) {
          console.log('isErrorResponse is ok');
          this.loginState = {
            status: 'error',
            errorResponse
          };
        } else {
          console.error(validateErrorResponse.errors);
          this.loginState = {
            status: 'error',
            errorResponse: {
              errorTitle: 'Неизвестная ошибка',
              errorSubtitle: JSON.stringify(validateErrorResponse.errors)
            }
          };
        }
      }
    } catch (err) {
      console.error(err);
      this.loginState = {
        status: 'error',
        errorResponse: {
          errorTitle: 'Неизвестная ошибка',
          errorSubtitle: JSON.stringify(err)
        }
      };
    }
    this.emit('loginStateChanged', this.loginState);
  }

  getLoginState() {
    return this.loginState;
  }
}