
import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import { 
  Feature
} from "sr2020-mm-event-engine";

import { WithFeatures } from "./index";

export interface WithSpiritFeatures {
  spiritFeatures: Feature[] | null;
}

const spiritFeatureIds = `mr-cellophane
aurma
i-shall-pass
hammer-time
adamantaeu
arr-ow
undiena
fireball-keeper
fireball-back
fireball-halfback
fireball-forward
aval-festival
date-of-birds
tick-a-lick-a-boo
over-the-pills
trackpointer
trackeeteer
get-high
get-low
auriel
reefwise
surge-the-unclean
ugly-is-pechi
beautti-frutti
barguzin-gift
kultuk-gift
sarma-gift
i-feel-it-in-the-water`.split('\n');

const spiritFeatureSet = new Set(spiritFeatureIds);

export const withSpiritFeatures = (Wrapped: any) => (props: any) => {
  const { features } = props as WithFeatures;
  if (features === null) {
    return <Wrapped {...props} spiritFeatures={null} />;
  }
  const spiritFeatures = features.filter(feature => spiritFeatureSet.has(feature.id));
  return <Wrapped {...props} spiritFeatures={spiritFeatures} />;
};
