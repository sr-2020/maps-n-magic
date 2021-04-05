import React, { Component, RefObject, ChangeEvent, FormEvent } from 'react';
import './CreateBeaconPopover.css';
import * as R from 'ramda';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { WithTranslation } from "react-i18next";

import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Form from 'react-bootstrap/Form';

const macAddressPattern = R.repeat('[0-9a-fA-F]{2}', 6).join(':');

function formatMacValue(str: string): string {
  const macLength = 12;
  if (str.length > macLength) {
    str = str.substring(0, macLength);
  } else {
    str += R.repeat('_', macLength - str.length).join('');
  }
  // const newStr = str.substring(0, macLength) + (macLength > str.length) ? R.repeat('_', macLength - str.length).join('') : '';
  // @ts-ignore
  const addColons: (arg: string) => string = R.pipe(
    R.splitEvery(2),
    R.join(':'),
  );
  return addColons(str);
}

// window.posMap = [
//   [0, 0],
//   [1, 1],
//   [2, 3],
//   [3, 4],
//   [4, 6],
//   [5, 7],
//   [6, 9],
//   [7, 10],
// ];

// import { CreateBeaconPopoverPropTypes } from '../../types';

interface CreateBeaconPopoverProps extends WithTranslation {
  createBeacon: (macAddress: string) => void
}
interface CreateBeaconPopoverState {
  macAddress: string;
}

export class CreateBeaconPopover extends Component<CreateBeaconPopoverProps, CreateBeaconPopoverState> {
  // static propTypes = CreateBeaconPopoverPropTypes;

  newBeaconMacInput: HTMLInputElement;

  constructor(props: CreateBeaconPopoverProps) {
    super(props);
    this.state = {
      macAddress: '',
    };
    this.handleBeaconSubmit = this.handleBeaconSubmit.bind(this);
    this.onMacAddressChange = this.onMacAddressChange.bind(this);
  }

  componentDidMount() {
    console.log('CreateBeaconPopover mounted');
  }

  componentDidUpdate() {
    console.log('CreateBeaconPopover did update');
  }

  componentWillUnmount() {
    console.log('CreateBeaconPopover will unmount');
  }


  onMacAddressChange(e: ChangeEvent<HTMLInputElement>) {
    const { value, selectionStart } = e.target;
    const cleanValue = value.replace(/(:|_)/g, '');

    const isMatch = /^[0-9a-fA-F]*$/.test(cleanValue);
    if (!isMatch) {
      this.setMacAddressPosition(cleanValue.length, selectionStart - 1);
      return;
    }

    this.setState(({ macAddress }) => {
      let changeIndex = -1;
      for (let i = 0; i < value.length; i++) {
        const char1 = value[i];
        const char2 = macAddress[i];
        if (char1 !== char2) {
          changeIndex = i;
          break;
        }
      }
      // if (changeIndex === macAddress.length) { // char at the end of the string
      //   return;
      // }
      this.setMacAddressPosition(changeIndex + 1, selectionStart + ((selectionStart + 1) % 3 === 0 ? 1 : 0));
      return {
        macAddress: cleanValue,
      };
    });
  }

  setMacAddressPosition(changeIndex: number, selectionStart: number) {
    setTimeout(() => {
      if (this.newBeaconMacInput) {
        // this.newBeaconMacInput.focus();
        // this.newBeaconMacInput.setSelectionRange(0, 0);
        const pos = changeIndex + Math.floor((changeIndex) / 2);
        // this.newBeaconMacInput.setSelectionRange(pos, pos);
        this.newBeaconMacInput.setSelectionRange(selectionStart, selectionStart);
      }
    }, 50);
  }

  getCreateBeaconPopover() {
    const { t } = this.props;
    const { macAddress } = this.state;
    return (
      <Popover id="popover-basic">
        <Popover.Title as="h3">{t('enterBeaconProperties')}</Popover.Title>
        {/* <Popover.Title as="h3">{t('beaconMacAddress')}</Popover.Title> */}
        <Popover.Content>
          <Form onSubmit={this.handleBeaconSubmit}>
            {/* <Form.Group controlId="beaconId">
              <Form.Label>{t('beaconId')}</Form.Label>
              <Form.Control
                type="text"
                required
                ref={(el) => (this.newBeaconIdInput = el)}
              />
            </Form.Group> */}
            <Form.Group controlId="beaconMacAddress">
              {/* <Form.Label>{t('beaconMacAddress')}</Form.Label> */}
              <Form.Control
                type="text"
                required
                className="tw-font-mono"
                pattern={macAddressPattern}
                value={formatMacValue(macAddress)}
                onChange={this.onMacAddressChange}
                ref={(el: HTMLInputElement) => (this.newBeaconMacInput = el)}
              />
              {/* <Form.Text className="text-muted">
                {t('macAddressInfoAdvice')}
              </Form.Text> */}
            </Form.Group>
            <div className="tw-text-right">
              <Button variant="primary" type="submit">
                {t('createBeacon')}
              </Button>
            </div>
          </Form>
        </Popover.Content>
      </Popover>
    );
  }

  handleBeaconSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const { createBeacon } = this.props;
      createBeacon(form.beaconMacAddress.value);
      // gameModel.execute({
      //   type: 'postBeaconRecord',
      //   props: { bssid: form.beaconMacAddress.value },
      // });
      this.setState({
        macAddress: '',
      });

      // form.beaconMacAddress.value = '';
    }
  }

  render() {
    // const { something } = this.state;
    const { t } = this.props;

    // if (!something) {
    //   return <div> CreateBeaconPopover stub </div>;
    //   // return null;
    // }
    return (
      <OverlayTrigger
        trigger="click"
        placement="right"
        overlay={this.getCreateBeaconPopover()}
        rootClose
        rootCloseEvent="click"
      >
        <button
          type="button"
          className="tw-btn tw-btn-blue tw-whitespace-no-wrap tw-flex-grow-0 newSpiritButton tw-mb-2"
          onClick={() => {
            setTimeout(() => {
              if (this.newBeaconMacInput) {
                this.newBeaconMacInput.focus();
                this.newBeaconMacInput.setSelectionRange(0, 0);
              }
            }, 50);
          }}
        >
          <FontAwesomeIcon className="tw-fill-current tw-w-4 tw-h-4 tw-mr-2" icon={faPlus} />
          <span>
            {t('newBeacon')}
          </span>
        </button>
      </OverlayTrigger>
    );
  }
}
