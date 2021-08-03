import React from 'react';
import { Translator } from "../utils/Translator";

export const TranslatorContext = React.createContext<Translator | null>(null);
export const TranslatorProvider = TranslatorContext.Provider;
export const TranslatorConsumer = TranslatorContext.Consumer;
