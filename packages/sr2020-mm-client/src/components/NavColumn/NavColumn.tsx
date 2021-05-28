import React from 'react';
import './NavColumn.css';

import { NavList, NavLinkData, SRTKey } from 'sr2020-mm-client-core';
import { useTranslation } from "react-i18next";

interface NavColumnProps {
  tKey: SRTKey;
  navLinks: NavLinkData[]
}

export function NavColumn(props: NavColumnProps) {
  const { tKey, navLinks } = props;
  const { t } = useTranslation();
  return (
    <div className="tw-mx-8 tw-my-4">
      <h2 className="tw-mt-8 tw-mb-4 tw-font-medium tw-text-2xl">{t(tKey)}</h2>
      <NavList navLinks={navLinks} />
    </div>
  )
}
