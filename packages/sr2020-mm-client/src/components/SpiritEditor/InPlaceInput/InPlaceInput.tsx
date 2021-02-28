import React, { Component } from 'react';
import './InPlaceInput.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

// import { InPlaceInputPropTypes } from '../../types';

interface InPlaceInputProps {
  value: any;
  t: any;
}
interface InPlaceInputState {
  editMode: boolean;
}

export class InPlaceInput extends Component<InPlaceInputProps, InPlaceInputState> {
  // static propTypes = InPlaceInputPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
    };
    this.editModeOff = this.editModeOff.bind(this);
    this.editModeOn = this.editModeOn.bind(this);
  }

  componentDidMount = () => {
    console.log('InPlaceInput mounted');
  }

  componentDidUpdate = () => {
    console.log('InPlaceInput did update');
  }

  componentWillUnmount = () => {
    console.log('InPlaceInput will unmount');
  }

  getViewContainer() {
    const { value } = this.props;
    return (
      <span
        className="
            view-container
            tw-outline-gray-500
            tw-outline-2
            hover:tw-outline-solid
            tw-cursor-text
            "
        title="Click to edit"
        onClick={this.editModeOn}
      >
        {value}
        <span className="button-container tw-bg-gray-500 tw-ml-2 tw-opacity-0">
          <button type="button" className="tw-bg-gray-500">
            <FontAwesomeIcon className="tw-w-4 tw-h-6" icon={faEdit} />
          </button>
        </span>
      </span>
    );
  }

  getEditContainer() {
    return (
      <form>
        <input />
        <button type="button" onClick={this.editModeOff}>Cancel</button>
        <button type="submit">OK</button>
      </form>
    );
  }

  editModeOn() {
    this.setState({
      editMode: true,
    });
  }

  editModeOff() {
    this.setState({
      editMode: false,
    });
  }

  render() {
    const { editMode } = this.state;
    const { t, children, value } = this.props;

    // if (!something) {
    //   return <div> InPlaceInput stub </div>;
    //   // return null;
    // }
    return (
      <span
        className="InPlaceInput"
      >
        {editMode ? this.getEditContainer() : this.getViewContainer()}
      </span>
    );
  }
}
