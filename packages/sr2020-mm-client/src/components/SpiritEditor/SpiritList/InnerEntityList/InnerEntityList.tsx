import React, { Component, MouseEvent, FormEvent, useState, MouseEventHandler } from 'react';
import './InnerEntityList.css';

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

import { EntitiyListItem } from "../types";

interface InnerEntityListProps extends WithTranslation {
  highlightStr: string;
  items: EntitiyListItem[];
  clone: (e: MouseEvent<HTMLInputElement>) => void;
  remove: (e: MouseEvent<HTMLInputElement>) => void;
  makeLink: (id: number, name: string) => string;
}

export function InnerEntityList(props: InnerEntityListProps) {
  const { 
    t, 
    highlightStr,
    items,
    clone, 
    remove,
    makeLink
  } = props;
  
  return (
    <ul>
      {
        // eslint-disable-next-line max-lines-per-function
        items.map(({id, title, subtitle}) => (
          <li key={id} className="EntityListItem tw-relative">
            <NavLink
              to={makeLink(id, title)}
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
                      data-id={id}
                      onClick={clone as (e: MouseEvent<DropdownItemProps>) => void }
                    >
                      {t('clone')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      data-id={id}
                      onClick={remove as (e: MouseEvent<DropdownItemProps>) => void }
                    >
                      {t('delete')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="body">
                <div className="spirit-name tw-font-bold tw-text-sm">
                  {
                    title ? (
                      <Highlight search={highlightStr} matchClass="tw-p-0 tw-bg-yellow-400 tw-text-color-inherit">
                        {title}
                      </Highlight>
                    ) : t('nameless')
                  }
                </div>
                <div className="spirit-fraction tw-text-sm">
                  {/* {spirit.fraction ? ( */}
                  <Highlight search={highlightStr} matchClass="tw-p-0 tw-bg-yellow-400 tw-text-color-inherit">
                    {subtitle}
                  </Highlight>
                  {/* // ) : t('noFraction')} */}
                </div>
              </div>
            </NavLink>
          </li>
        ))
      }
    </ul>
  )
}