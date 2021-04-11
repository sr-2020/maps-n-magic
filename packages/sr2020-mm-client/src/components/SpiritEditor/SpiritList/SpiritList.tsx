import React, { Component, MouseEvent, FormEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import './SpiritList.css';

import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Form from 'react-bootstrap/Form';
import * as R from 'ramda';
import Dropdown from 'react-bootstrap/Dropdown';
import { DropdownItemProps } from 'react-bootstrap/DropdownItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import {
  NavLink, Route, Redirect,
} from 'react-router-dom';
import Highlight from 'react-highlighter';
import { WithTranslation } from "react-i18next";

import { Spirit, GameModel } from "sr2020-mm-event-engine";
import { EPutSpirit } from "sr2020-mm-client-event-engine";

import { Search } from './Search';

const sort = R.sortBy(R.pipe(R.prop('name'), R.toLower));

const spiritLink = (spirit: Spirit) => `/spiritEditor/${spirit.id}#${spirit.name}`;

interface SpiritListProps extends WithTranslation, RouteComponentProps {
  spiritService: GameModel;
}
interface SpiritListState {
  spirits: Spirit[],
  removedSpiritIndex: number | null,
  searchStr: string,
}

export class SpiritList extends Component<SpiritListProps, SpiritListState> {
  newSpiritInput: HTMLInputElement;

  constructor(props: SpiritListProps) {
    super(props);
    this.state = {
      spirits: [],
      removedSpiritIndex: null,
      searchStr: '',
    };
    this.onPutSpirit = this.onPutSpirit.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.handleSpiritSubmit = this.handleSpiritSubmit.bind(this);
  }

  componentDidMount = () => {
    // console.log('SpiritList mounted');
    // const spirits = this.props.spiritService.getSpirits();
    const spirits = this.props.spiritService.get<Spirit[]>('spirits');

    const spirits2 = sort(spirits || []);
    this.setState({
      spirits: spirits2,
    });
    this.props.spiritService.on('putSpirit', this.onPutSpirit);
  }

  componentDidUpdate = (prevProps: SpiritListProps) => {
    if (prevProps.spiritService === this.props.spiritService) {
      return;
    }
    prevProps.spiritService.off('putSpirit', this.onPutSpirit);
    this.props.spiritService.on('putSpirit', this.onPutSpirit);
    // const spirits = this.props.spiritService.getSpirits();
    const spirits = this.props.spiritService.get<Spirit[]>('spirits');
    const spirits2 = sort(spirits || []);
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({
      spirits: spirits2,
      removedSpiritIndex: null,
      searchStr: '',
    });
    // console.log('SpiritList did update');
  }

  componentWillUnmount = () => {
    // console.log('SpiritList will unmount');
    this.props.spiritService.off('putSpirit', this.onPutSpirit);
  }

  // eslint-disable-next-line react/sort-comp
  onPutSpirit({spirit}: EPutSpirit) {
    const { spirits } = this.state;
    const newSpirits = spirits.map((spirit) => {
      if (spirit.id !== spirit.id) {
        return spirit;
      }
      return spirit;
    });

    this.setState({
      spirits: sort(newSpirits),
      removedSpiritIndex: null,
    });
  }

  onSearchChange(searchStr: string) {
    this.setState({
      searchStr,
    });
  }

  // eslint-disable-next-line max-lines-per-function
  getSpiritList() {
    const { spirits, searchStr } = this.state;
    const { t } = this.props;
    const lowerSearchStr = searchStr.toLowerCase();
    // eslint-disable-next-line max-lines-per-function
    return spirits.filter((spirit) => spirit.name.toLowerCase().includes(lowerSearchStr) || spirit.fraction.toLowerCase().includes(lowerSearchStr))
      // eslint-disable-next-line max-lines-per-function
      .map((spirit) => (
        <li key={spirit.id} className="SpiritListItem tw-relative">
          <NavLink
            to={spiritLink(spirit)}
            className="
                NavLink
                tw-px-3
                tw-py-2
                tw-block
                tw-text-gray-900
                hover:tw-text-gray-900
                tw-no-underline
                hover:tw-no-underline
                focus:tw-outline-none
                focus:tw-shadow-outline
                hover:tw-bg-indigo-200
                active:tw-bg-indigo-600
              "
          >
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
                    SpiritMenuButton
                    tw-w-8
                    tw-h-8
                    hover:tw-bg-indigo-300
                    active:tw-bg-indigo-600
                    focus:tw-outline-none
                    focus:tw-shadow-outline
                    active:tw-bg-indigo-600
                    tw-opacity-0
                    hover:tw-opacity-100
                    focus:tw-opacity-100
                    tw-dropdown-toggle
                    tw-p-0
                  "
                >
                  <FontAwesomeIcon icon={faEllipsisH} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    as="button"
                    onClick={(e: MouseEvent<DropdownItemProps>) => this.cloneSpirit(e, spirit.id)}
                  >
                    {t('clone')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={(e: MouseEvent<DropdownItemProps>) => this.removeSpirit(e, spirit.id)}
                  >
                    {t('delete')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="body">
              <div className="spirit-name tw-font-bold tw-text-sm">
                {
                  spirit.name ? (
                    <Highlight search={lowerSearchStr} matchClass="tw-p-0 tw-bg-yellow-400 tw-text-color-inherit">
                      {spirit.name}
                    </Highlight>
                  ) : t('nameless')
                }
              </div>
              <div className="spirit-fraction tw-text-sm">
                {spirit.fraction ? (
                  <Highlight search={lowerSearchStr} matchClass="tw-p-0 tw-bg-yellow-400 tw-text-color-inherit">
                    {spirit.fraction}
                  </Highlight>
                ) : t('noFraction')}
              </div>
            </div>
          </NavLink>
        </li>
      ));
  }

  getCreateSpiritPopover() {
    const { t } = this.props;
    return (
      <Popover id="popover-basic">
        <Popover.Title as="h3">{t('enterSpiritName')}</Popover.Title>
        <Popover.Content>
          <Form onSubmit={this.handleSpiritSubmit}>
            <Form.Group controlId="spiritName">
              <Form.Control
                type="text"
                required
                ref={(el: HTMLInputElement) => (this.newSpiritInput = el)}
              />
            </Form.Group>
            <div className="tw-text-right">
              <Button variant="primary" type="submit">
                {t('createSpirit')}
              </Button>
            </div>
          </Form>
        </Popover.Content>
      </Popover>
    );
  }

  createNewSpirit(spiritName: string) {
    const { spiritService, history } = this.props;
    // const spirit = spiritService.postSpirit({ name: spiritName });
    const spirit = spiritService.execute({
      type: 'postSpirit',
      props: { name: spiritName },
    }) as Spirit;
    history.push(spiritLink(spirit));
    this.setState((state) => {
      const spirits = sort([...state.spirits, spirit]);
      return {
        spirits,
        removedSpiritIndex: null,
      };
    });
  }

  cloneSpirit(e: MouseEvent<DropdownItemProps>, id: number) {
    e.preventDefault();
    e.stopPropagation();
    const { spiritService, history } = this.props;
    // const spirit = spiritService.cloneSpirit(id);
    const spirit = spiritService.execute<Spirit>({
      type: 'cloneSpirit',
      id,
    });
    history.push(spiritLink(spirit));
    this.setState((state: SpiritListState) => {
      const spirits = sort([...state.spirits, spirit]);
      return {
        spirits,
        removedSpiritIndex: null,
      };
    });
  }

  removeSpirit(e: MouseEvent<DropdownItemProps>, id: number) {
    e.preventDefault();
    e.stopPropagation();
    const { spiritService } = this.props;
    // spiritService.deleteSpirit(id);
    spiritService.execute({
      type: 'deleteSpirit',
      id,
    });
    this.setState((state) => {
      const index = state.spirits.findIndex((spirit) => spirit.id === id);
      const spirits = state.spirits.filter((spirit) => spirit.id !== id);
      // history.push(spiritLink(spirits[index] || spirits[index - 1]));
      return {
        spirits,
        removedSpiritIndex: index,
      };
    });
  }

  handleSpiritSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      this.createNewSpirit(form.spiritName.value);
      form.spiritName.value = '';
    }
  }


  // eslint-disable-next-line max-lines-per-function
  render() {
    const { spirits, removedSpiritIndex } = this.state;
    const { t } = this.props;

    // if (newSpirit) {
    //   return <Redirect to={spiritLink(newSpirit)} />;
    // }

    return (
      <div className="SpiritList tw-flex-grow-0 tw-flex tw-flex-col tw-bg-gray-200">

        <div className="tw-bg-gray-400 tw-flex-grow-0 tw-text-right tw-px-3 tw-py-2 tw-flex">
          <Search
            className="tw-flex-grow"
            placeholder={t('findSpirit')}
            onSearchChange={this.onSearchChange}
          />
          <OverlayTrigger
            trigger="click"
            placement="right"
            overlay={this.getCreateSpiritPopover()}
            rootClose
            rootCloseEvent="click"
          >
            <button
              type="button"
              className="tw-btn tw-btn-blue tw-whitespace-no-wrap tw-flex-grow-0 newSpiritButton tw-ml-4"
              onClick={() => {
                setTimeout(() => {
                  if (this.newSpiritInput) {
                    this.newSpiritInput.focus();
                  }
                }, 50);
              }}
            >
              <FontAwesomeIcon className="tw-fill-current tw-w-4 tw-h-4 tw-mr-2" icon={faPlus} />
              <span>
                {t('newSpirit')}
              </span>
            </button>
          </OverlayTrigger>
        </div>
        <Route
          path="/spiritEditor"
          render={() => (spirits.length === 0
            ? <div className="alert-block alert alert-info">{t('createSpirits')}</div>
            : <Redirect to={spiritLink(spirits[0])} />)}
          exact
        />
        <Route
          path="/spiritEditor/:id"
          render={({ match }) => {
            const { id } = match.params;
            if (!spirits.map(R.prop('id')).includes(Number(id))) {
              if (spirits.length === 0) {
                return <Redirect to="/spiritEditor" />;
              }
              if (removedSpiritIndex) {
                return <Redirect to={spiritLink(spirits[removedSpiritIndex] || spirits[removedSpiritIndex - 1])} />;
              }
              return <Redirect to={spiritLink(spirits[0])} />;
            }

            return null;
          }}
        />
        <div className=" tw-flex-grow tw-overflow-auto">
          <ul>
            {
              this.getSpiritList()
            }
          </ul>
        </div>
      </div>
    );
  }
}
