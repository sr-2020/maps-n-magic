import React, { Component } from 'react';
import './NotificationWatcher.css';

import { GameModel, NotificationData, EPostNotification } from "sr2020-mm-event-engine";

import { ToastWrapper } from './ToastWrapper';

interface NotificationWatcherProps {
  gameModel: GameModel;
}
interface NotificationWatcherState {
  notifications: NotificationData[];
}

export class NotificationWatcher extends Component<NotificationWatcherProps, NotificationWatcherState> {
  constructor(props: NotificationWatcherProps) {
    super(props);
    this.state = {
      notifications: [
        // {
        //   title: 'Test',
        //   message: 'Some body',
        //   kind: 'error',
        // },
        // {
        //   title: 'Test',
        //   message: 'Some body',
        //   kind: 'success',
        // },
        // {
        //   title: 'Test',
        //   message: 'Some body',
        //   kind: 'warning',
        // },
        // {
        //   title: 'Test',
        //   message: 'Some body',
        //   kind: 'info',
        // },
      ],
    };
    this.onPostNotification = this.onPostNotification.bind(this);
    this.onClearNotification = this.onClearNotification.bind(this);
  }

  componentDidMount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('on2', gameModel);
    console.log('NotificationWatcher mounted');
  }

  componentDidUpdate(prevProps: NotificationWatcherProps) {
    const {
      gameModel,
    } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.subscribe('off', prevProps.gameModel);
      this.subscribe('on2', gameModel);
    }
    console.log('NotificationWatcher did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    console.log('NotificationWatcher will unmount');
  }

  onPostNotification(notification: EPostNotification) {
    // console.error(kind, title, message);
    this.setState(({ notifications }) => ({
      notifications: [...notifications, notification],
    }));
  }

  onClearNotification(notification: NotificationData): void {
    this.setState(({ notifications }) => ({
      notifications: notifications.filter((n) => n !== notification),
    }));
  }

  subscribe(action: 'on2'|'off', gameModel: GameModel) {
    gameModel[action]('postNotification', this.onPostNotification);
  }

  render() {
    const { notifications } = this.state;

    return (

      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'relative',
          // minHeight: '200px',
        }}
      >
        <div
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            minWidth: '18rem',
            zIndex: 1000,
          }}
        >
          {
            notifications.map((n) => (
              <ToastWrapper
                notification={n}
                onClearNotification={this.onClearNotification}
              />
            ))
          }

        </div>
      </div>
    );
  }
}
