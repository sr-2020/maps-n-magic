import React, { Component } from 'react';
import './NotificationWatcher.css';

// import { ErrorWatcherPropTypes } from '../../types';
import { ToastWrapper } from './ToastWrapper';

export class NotificationWatcher extends Component {
  // static propTypes = ErrorWatcherPropTypes;

  constructor(props) {
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
    this.onPostNotifiaction = this.onPostNotifiaction.bind(this);
    this.onClearNotification = this.onClearNotification.bind(this);
  }

  componentDidMount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('on', gameModel);
    console.log('NotificationWatcher mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      gameModel,
    } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.subscribe('off', prevProps.gameModel);
      this.subscribe('on', gameModel);
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

  onPostNotifiaction(notification) {
    // console.error(kind, title, message);
    this.setState(({ notifications }) => ({
      notifications: [...notifications, notification],
    }));
  }

  onClearNotification(notification) {
    this.setState(({ notifications }) => ({
      notifications: notifications.filter((n) => n !== notification),
    }));
  }

  subscribe(action, gameModel) {
    gameModel[action]('postNotification', this.onPostNotifiaction);
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
