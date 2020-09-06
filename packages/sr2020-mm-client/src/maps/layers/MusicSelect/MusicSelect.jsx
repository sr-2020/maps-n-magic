import React, { Component } from 'react';
import './MusicSelect.css';
import ReactDOM from 'react-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretRight, faTimes, faChevronRight, faCheck,
} from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

// import { MusicSelectPropTypes } from '../../../../types';

import { musicSelectDom } from '../../../../utils/domUtils';

import { MusicSelectControl } from '../../../MusicSelectControl';

export class MusicSelect extends Component {
  // static propTypes = MusicSelectPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      // show: true,
      show: false,
    };

    this.onSelectClick = this.onSelectClick.bind(this);
  }

  componentDidMount = () => {
    console.log('MusicSelect mounted');
  }

  componentDidUpdate = (prevProps) => {
    console.log('MusicSelect did update');
  }

  componentWillUnmount = () => {
    console.log('MusicSelect will unmount');
  }

  onSelectClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState((state) => ({
      show: !state.show,
    }));
    // return false;
  }

  // eslint-disable-next-line max-lines-per-function
  makeContent() {
    const {
      show,
    } = this.state;
    // if (!initialized) {
    //   return null;
    // }
    const { t, gameModel } = this.props;
    return (
      <div className="MusicSelect relative text-right">
        <button
          type="button"
          className="text-base bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 pl-3 pr-2 rounded focus:outline-none focus:shadow-outline"
          onClick={this.onSelectClick}
        >
          <span>{t('selectMusic')}</span>
          <FontAwesomeIcon className="ml-1 text-base w-4 h-4" fixedWidth icon={show ? faTimes : faChevronRight} />
        </button>
        <div className={classNames('button-panel relative  text-left', {
          'hidden-panel': !show,
        })}
        >
          <MusicSelectControl gameModel={gameModel} />
        </div>

      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(
      this.makeContent(),
      musicSelectDom,
    );
  }

  // render() {
  //   const { something } = this.state;
  //   // const { t } = this.props;

  //   if (!something) {
  //     return <div> MusicSelect stub </div>;
  //     // return null;
  //   }
  //   return (
  //     <div className="MusicSelect">
  //       MusicSelect body
  //     </div>
  //   );
  // }
}
