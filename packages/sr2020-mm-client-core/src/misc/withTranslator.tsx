import React from 'react';
import { TranslatorConsumer } from './translatorContext';

export const withTranslator = (Wrapped: any) => (props: any) => (
  <TranslatorConsumer>
    {
      (translator) => (
        <Wrapped
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          // virtualCenter={virtualCenter}
          translator={translator}
        />
      )
    }
  </TranslatorConsumer>
);
