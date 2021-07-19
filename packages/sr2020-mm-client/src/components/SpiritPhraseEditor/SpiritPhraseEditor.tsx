import React, { 
  ChangeEvent, 
  Component, 
  ChangeEventHandler,
  MouseEvent 
} from 'react';
import './SpiritPhraseEditor.css';

import { EDeleteSpiritPhraseRequested, EPostSpiritPhrase, EPostSpiritPhraseRequested, GameModel } from 'sr2020-mm-event-engine';
import { WithSpiritPhrases } from '../../dataHOCs';

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

import Dropdown from 'react-bootstrap/Dropdown';
import { DropdownItemProps } from 'react-bootstrap/DropdownItem';
import { WithTranslation } from "react-i18next";
import Form from 'react-bootstrap/Form';

interface SpiritPhraseEditorProps extends WithTranslation, WithSpiritPhrases {
  gameModel: GameModel;
}

export function SpiritPhraseEditor(props: SpiritPhraseEditorProps) {
  const { gameModel, spiritPhrases, t } = props;

  if (spiritPhrases === null) {
    return (
      <div>Фразы духов загружаются...</div>
    );
  }

  function createSpiritPhrase(): void {
    // const { gameModel } = this.props;
    // console.log('createBeacon', this.state.beaconRecords.length);
    gameModel.emit2<EPostSpiritPhraseRequested>({
      type: 'postSpiritPhraseRequested',
      props: {},
    });
  }

  function removeSpiritPhrase(e: MouseEvent<DropdownItemProps>, id: number): void {
    e.preventDefault();
    e.stopPropagation();
    gameModel.emit2<EDeleteSpiritPhraseRequested>({
      type: 'deleteSpiritPhraseRequested',
      id,
    });
  }


  return (
    <div className="SpiritPhraseEditor tw-px-8 tw-py-4 tw-h-full tw-overflow-auto">
      {/* {JSON.stringify(spiritPhrases)} */}
      
      <Button onClick={createSpiritPhrase}>Создать фразу</Button>

        <Table
          // bordered
          hover
          size="sm"
          className="tw-w-auto"
          // style={{ width: '40rem' }}
        >
          <thead>
            <tr>
              <th className="tw-text-right">Start date</th>
              <th>End date</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>

            {
              // eslint-disable-next-line max-lines-per-function
              spiritPhrases.map((phrase) => (
                <tr key={phrase.id}>
                  <td className="tw-text-right">{phrase.startDate}</td>
                  <td className="tw-text-right">{phrase.endDate}</td>
                  <td className="tw-text-right">
                    <Form.Control
                      name="label"
                      type="text"
                      style={{ width: '48rem' }}
                      defaultValue={phrase.message}
                      data-id-str={phrase.id}
                      // onChange={this.handleInputChange}
                    />
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
                            onClick={(e: MouseEvent<DropdownItemProps>) => removeSpiritPhrase(e, phrase.id)}
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



