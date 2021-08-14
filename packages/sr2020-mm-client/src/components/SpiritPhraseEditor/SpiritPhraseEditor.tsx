import React, { 
  ChangeEvent, 
  Component, 
  ChangeEventHandler,
  MouseEvent 
} from 'react';
import './SpiritPhraseEditor.css';

import { EDeleteSpiritPhraseRequested, EPostSpiritPhrase, EPostSpiritPhraseRequested, EPutSpiritPhrase, EPutSpiritPhraseRequested, GameModel } from 'sr2020-mm-event-engine';
import { WithSpiritPhrases } from '../../dataHOCs';

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import TimePicker, { TimePickerValue } from "react-time-picker";
import DateTimePicker from 'react-datetime-picker';
import DateTimePicker1 from 'wojtekmaj__react-datetimerange-picker';



import Dropdown from 'react-bootstrap/Dropdown';
import { DropdownItemProps } from 'react-bootstrap/DropdownItem';
import { WithTranslation } from "react-i18next";
import Form from 'react-bootstrap/Form';
import { SRTKey } from 'sr2020-mm-client-core';

interface SpiritPhraseEditorProps extends WithTranslation, WithSpiritPhrases {
  gameModel: GameModel;
}

type PropChange = 
  | {prop: 'message', value: string}
  | {prop: 'characterId', value: number | null}
  | {prop: 'spiritFractionId', value: number | null}
;

const spiritFractions: {
  id: number;
  name: SRTKey;
}[] = [{
  id: -1,
  name: 'fractionNotSelected'
},{
  id: 2,
  name: 'barguzin'
},{
  id: 3,
  name: 'kultuk'
},{
  id: 4,
  name: 'sarma'
}]

export class SpiritPhraseEditor extends Component<SpiritPhraseEditorProps> {
  updateSpiritPhraseTimeoutId: NodeJS.Timeout | undefined;

  constructor(props: SpiritPhraseEditorProps) {
    super(props);
    this.createSpiritPhrase = this.createSpiritPhrase.bind(this);
    this.onDateTimeChange = this.onDateTimeChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCharacterIdChange = this.handleCharacterIdChange.bind(this);
    this.handleFractionIdChange = this.handleFractionIdChange.bind(this);
  }

  createSpiritPhrase(): void {
    const { gameModel } = this.props;
    // console.log('createBeacon', this.state.beaconRecords.length);
    gameModel.emit2<EPostSpiritPhraseRequested>({
      type: 'postSpiritPhraseRequested',
      props: {},
    });
  }

  removeSpiritPhrase(e: MouseEvent<DropdownItemProps>, id: number): void {
    e.preventDefault();
    e.stopPropagation();
    const { gameModel } = this.props;
    gameModel.emit2<EDeleteSpiritPhraseRequested>({
      type: 'deleteSpiritPhraseRequested',
      id,
    });
  }

  handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const { target } = event;
    const { idStr } = event.target.dataset;
    const value = target.value;
    const name = target.name as 'message';
    if(!['message'].includes(name)) {
      throw new Error('Unexpected spirit phrase prop name: ' + name);
    }
    this.putBeaconRecord(Number(idStr), {prop: name, value});
  }

  handleCharacterIdChange(event: ChangeEvent<HTMLInputElement>): void {
    const { target } = event;
    const { idStr } = event.target.dataset;
    const value = target.value;
    const name = target.name as 'characterId';
    if(!['characterId'].includes(name)) {
      throw new Error('Unexpected spirit phrase prop name: ' + name);
    }
    if (value.trim() === '') {
      this.putBeaconRecord(Number(idStr), {prop: name, value: null});
    } else {
      const number = Number(value);
      if (!Number.isNaN(number)) {
        this.putBeaconRecord(Number(idStr), {prop: name, value: number});
      }
    }
  }

  handleFractionIdChange(event: ChangeEvent<HTMLSelectElement>): void {
    const { value } = event.target;
    const { idStr } = event.target.dataset;
    const newValue = Number(value) === -1 ? null : Number(value);
    this.putBeaconRecord(Number(idStr), {prop: 'spiritFractionId', value: newValue});
    // onLocationSelect(Number(idStr), newValue);
  }

  putBeaconRecord(id: number, propChange: PropChange): void {
    const { gameModel } = this.props;

    if (this.updateSpiritPhraseTimeoutId !== undefined) {
      clearTimeout(this.updateSpiritPhraseTimeoutId);
    }

    this.updateSpiritPhraseTimeoutId = setTimeout(() => {
      gameModel.emit2<EPutSpiritPhraseRequested>({
        type: 'putSpiritPhraseRequested',
        id,
        props: {
          [propChange.prop]: propChange.value,
        },
      });
    }, 500);
  }

  onDateTimeChange(id: number, prop: string, value: Date) {
    const { gameModel } = this.props;
    gameModel.emit2<EPutSpiritPhraseRequested>({
      type: 'putSpiritPhraseRequested',
      id,
      props: {
        [prop]: value.getTime(),
      },
    });
  };

  render() {
    const { gameModel, spiritPhrases, t } = this.props;
  
    if (spiritPhrases === null) {
      return (
        <div>{t('spiritPhrasesLoading')}</div>
      );
    }
  
    return (
      <div className="SpiritPhraseEditor tw-px-8 tw-py-4 tw-h-full tw-overflow-auto">
        <Button onClick={this.createSpiritPhrase}>{t('createPhrase')}</Button>
  
          <Table
            hover
            size="sm"
            className="tw-w-auto"
          >
            <thead>
              <tr>
                <th>Start date</th>
                <th>End date</th>
                <th>Message</th>
                <th>Character id</th>
                <th>Fraction id</th>
                <th>Delivered</th>
              </tr>
            </thead>
            <tbody>
              {
                spiritPhrases.map((phrase) => (
                  <tr key={phrase.id}>
                    <td className="tw-text-right">
                      <DateTimePicker
                        onChange={(value: Date) => this.onDateTimeChange(phrase.id, 'startDate', value)}
                        value={new Date(phrase.startDate)}
                      />
                    </td>
                    <td className="tw-text-right">
                      <DateTimePicker
                        onChange={(value: Date) => this.onDateTimeChange(phrase.id, 'endDate', value)}
                        value={new Date(phrase.endDate)}
                      />
                    </td>
                    <td className="tw-text-right">
                      <Form.Control
                        name="message"
                        type="text"
                        style={{ width: '40rem' }}
                        defaultValue={phrase.message}
                        data-id-str={phrase.id}
                        onChange={this.handleInputChange}
                      />
                    </td>
                    <td className="tw-text-right">
                      <Form.Control
                        name="characterId"
                        type="text"
                        style={{ width: '8rem' }}
                        defaultValue={phrase.characterId || ''}
                        data-id-str={phrase.id}
                        onChange={this.handleCharacterIdChange}
                      />
                      {/* {phrase.characterId} */}
                    </td>
                    <td className="tw-text-right">
                      <Form.Control 
                        as="select" 
                        name="spiritFractionId"
                        className=""
                        value={phrase.spiritFractionId || 0}
                        data-id-str={phrase.id}
                        onChange={this.handleFractionIdChange}
                      >
                        {
                          spiritFractions.map((fraction) => (
                            <option
                              key={fraction.id}
                              value={fraction.id}
                            >
                              {t(fraction.name)}
                            </option>
                          ))
                        }
                      </Form.Control>
                      {/* {phrase.spiritFractionId} */}
                    </td>
                    <td className="tw-text-right">
                      {phrase.characterId !== null && String(phrase.delivered)}
                    </td>
                    <td>
                      <div className="menu tw-float-right">
                        <Dropdown
                          onToggle={(isOpen, e) => {
                            if (e.stopPropagation) e.stopPropagation();
                            if (e.preventDefault) e.preventDefault();
                          }}
                        >
                          <Dropdown.Toggle className="
                              tw-btn
                              tw-btn-ghost
                              EntityMenuButton
                              tw-h-8
                              hover:tw-bg-indigo-300
                              active:tw-bg-indigo-600
                              focus:tw-outline-none
                              focus:tw-shadow-outline
                              active:tw-bg-indigo-600
                              hover:tw-opacity-100
                              focus:tw-opacity-100
                              tw-dropdown-toggle
                            "
                          >
                            {t('actionMenu')}
                          </Dropdown.Toggle>
  
                          <Dropdown.Menu>
                            <Dropdown.Item
                              as="button"
                              onClick={(e: MouseEvent<DropdownItemProps>) => this.removeSpiritPhrase(e, phrase.id)}
                            >
                              {t('delete')}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
      </div>
    );
  }
}




