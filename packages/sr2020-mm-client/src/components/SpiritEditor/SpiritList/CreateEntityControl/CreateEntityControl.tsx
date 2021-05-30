import React, { Component, MouseEvent, FormEvent, useState, MouseEventHandler } from 'react';
import './CreateEntityControl.css';
import { RouteComponentProps } from 'react-router-dom';
import { WithTranslation } from "react-i18next";

import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Form from 'react-bootstrap/Form';
import * as R from 'ramda';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { SRTKey } from 'sr2020-mm-client-core';


interface CreateEntityControlProps extends WithTranslation {
  onCreateEntity: (entityName: string) => void;
  controlTitle: SRTKey;
  formTitle: SRTKey;
  submitButtonText: SRTKey;
}

export class CreateEntityControl extends Component<CreateEntityControlProps> {
  entityNameInput: HTMLInputElement;

  constructor(props: CreateEntityControlProps) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event: FormEvent<HTMLFormElement>): void {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    const { onCreateEntity } = this.props;
    if (form.checkValidity() === true) {
      onCreateEntity(form.entityName.value);
      form.entityName.value = '';
    }
  }

  getCreateEntityPopover() {
    const { t, submitButtonText, formTitle } = this.props;
    return (
      <Popover id="popover-basic">
        <Popover.Title as="h3">{t(formTitle)}</Popover.Title>
        <Popover.Content>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="entityName">
              <Form.Control
                type="text"
                required
                ref={(el: HTMLInputElement) => (this.entityNameInput = el)}
              />
            </Form.Group>
            <div className="tw-text-right">
              <Button variant="primary" type="submit">
                {t(submitButtonText)}
              </Button>
            </div>
          </Form>
        </Popover.Content>
      </Popover>
    );
  }

  render() {
    const { t, controlTitle } = this.props;
    return (
      <OverlayTrigger
        trigger="click"
        placement="right"
        overlay={this.getCreateEntityPopover()}
        rootClose
        rootCloseEvent="click"
      >
        <button
          type="button"
          className="tw-btn tw-btn-blue tw-whitespace-no-wrap tw-flex-grow-0 newEntityButton tw-ml-4"
          onClick={() => {
            setTimeout(() => {
              if (this.entityNameInput) {
                this.entityNameInput.focus();
              }
            }, 50);
          }}
        >
          <FontAwesomeIcon className="tw-fill-current tw-w-4 tw-h-4 tw-mr-2" icon={faPlus} />
          <span>
            {t(controlTitle)}
          </span>
        </button>
      </OverlayTrigger>
    )
  }
}