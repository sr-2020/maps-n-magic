import React, { Component, MouseEvent, FormEvent, useState, MouseEventHandler } from 'react';
import './InnerEntityRoutes.css';

import * as R from 'ramda';
import {
  NavLink, Route, Redirect,
} from 'react-router-dom';
import { WithTranslation } from "react-i18next";

import { SRTKey } from 'sr2020-mm-client-core';

import { EntitiyListItem } from "../types";


interface InnerEntityRoutesProps {
  t: WithTranslation["t"];
  items: EntitiyListItem[];
  removedEntityIndex: number | null;
  linkRoot: string;
  noEntitiesAdvice: SRTKey;
  makeLink: (id: number, name: string) => string;
}

export function InnerEntityRoutes(props: InnerEntityRoutesProps) {
  const { items, t, removedEntityIndex, makeLink, linkRoot, noEntitiesAdvice } = props;
  const linkRoot2 = `/${linkRoot}`;
  return (
    <>
      <Route
        path={linkRoot2}
        render={() => (items !== null && items.length > 0
          ? <Redirect to={makeLink(items[0].id, items[0].title)} />
          : <div className="alert-block alert alert-info">{t(noEntitiesAdvice)}</div>)}
        exact
      />
      <Route
        path={`${linkRoot2}/:id`}
        render={({ match }) => {
          const { id } = match.params;
          if (items === null) {
            return null;
          }
          if (!items.map(R.prop('id')).includes(Number(id))) {
            if (items.length === 0) {
              return <Redirect to={linkRoot2} />;
            }
            if (removedEntityIndex) {
              const item = items[removedEntityIndex] || items[removedEntityIndex - 1];
              return <Redirect to={makeLink(item.id, item.title)} />;
            }
            return <Redirect to={makeLink(items[0].id, items[0].title)} />;
          }

          return null;
        }}
      />
    </>
  )
}
