import React, { Component } from 'react';
import './MusicSelect.css';
import ReactDOM from 'react-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretRight, faTimes, faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
// import { MusicSelectPropTypes } from '../../types';

import { musicSelectDom } from '../../../utils/domUtils';

export class MusicSelect extends Component {
  // static propTypes = MusicSelectPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };

    this.onSelectClick = this.onSelectClick.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  // componentDidMount = () => {
  //   console.log('MusicSelect mounted');
  // }

  // componentDidUpdate = () => {
  //   console.log('MusicSelect did update');
  // }

  // componentWillUnmount = () => {
  //   console.log('MusicSelect will unmount');
  // }

  // eslint-disable-next-line class-methods-use-this
  onDoubleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    // return false;
  }

  onSelectClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState((state) => ({
      show: !state.show,
    }));
    // return false;
  }

  makeContent() {
    const { show } = this.state;
    // console.log(this.props);
    return (
      <div className="MusicSelect relative">
        <div className={classNames('button-panel relative', {
          'hidden-panel': !show,
        })}
        >
          <ul className="mb-0">
            <li>
              <button type="button" className="font-bold py-2 px-4 focus:outline-none focus:shadow-outline bg-gray-300 hover:bg-gray-400 text-gray-800 w-full">Low</button>
            </li>
            <li>
              <button type="button" className="font-bold py-2 px-4 focus:outline-none focus:shadow-outline bg-gray-300 hover:bg-gray-400 text-gray-800 w-full">Medium</button>
            </li>
            <li>
              <button type="button" className="font-bold py-2 px-4 focus:outline-none focus:shadow-outline bg-gray-300 hover:bg-gray-400 text-gray-800 w-full">High</button>
            </li>
          </ul>
        </div>
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 pl-3 pr-2 rounded focus:outline-none focus:shadow-outline"
          onClick={this.onSelectClick}
          // onDoubleClickCapture={this.onDoubleClick}
        >
          <span>Select Music</span>
          <FontAwesomeIcon className="ml-1 text-base w-4 h-4" fixedWidth icon={show ? faTimes : faChevronRight} />
        </button>
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
