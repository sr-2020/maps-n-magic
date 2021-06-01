import React, { FormEvent } from 'react';
import './RouteInput.css';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import * as R from 'ramda';

import { WithTranslation } from "react-i18next";

import { WithSpiritRoutes } from '../../../../dataHOCs';

interface RouteInputProps extends WithTranslation, WithSpiritRoutes {
  addRoute: (routeId: number) => void;
}

export function RouteInput(props: RouteInputProps) {
  const { t, spiritRoutes } = props;

  if (spiritRoutes === null) {
    return (
      <div>Маршруты духов не загружены</div>
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    e.stopPropagation();
    e.preventDefault();
    const { spiritRoutes, addRoute } = props;
    if (form.checkValidity() === true && spiritRoutes !== null) {
      const routeId = Number(form.newRoute.value.trim());

      const routeIds = R.pluck('id', spiritRoutes);
      if (routeIds.includes(routeId)) {
        // addWaypoint(routeId);
        addRoute(routeId);
        form.newRoute.value = '';
      }
    }
  }

  return (
    <Form className="RouteInput" onSubmit={onSubmit}>
      <InputGroup className="tw-mb-3">
        <FormControl required id="newRoute" list="routes-datalist" />
        <InputGroup.Append>
          <Button type="submit" variant="outline-secondary">Добавить маршрут</Button>
        </InputGroup.Append>
      </InputGroup>
      <datalist id="routes-datalist">
        {
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
          spiritRoutes.map((route) => <option key={route.id} value={route.id}>{`${route.name} (${route.id})`}</ option>)
        }
      </datalist>
    </Form>
  );
}



