import { LoginState } from "../types";
import { EventEmitter } from "events";
import { isLoggedIn } from "../api";

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

  async updateLoginState() {
    try {
      const res = await isLoggedIn();
      // fetch('/api/isLoggedIn');
      if (res.status === 401) {
        this.loginState = {
          status: 'userUnlogged'
        };
      } else if (res.status === 200) {
        this.loginState = {
          status: 'userLogged'
        };
      } else {
        this.loginState = {
          status: 'error'
        };
      }
    } catch (err) {
      this.loginState = {
        status: 'error'
      };
    }
    this.emit('loginStateChanged', this.loginState);
  }

  getLoginState() {
    return this.loginState;
  }
}