import { createLogger } from "../../logger";

const logger = createLogger('pubSubSubscriptions.ts');

let rescueServiceSubscriptionName: string;
let charLocChangeSubscriptionName: string;
let manaOceanSpellCastSubscriptionName: string;
let charLocChange2SubscriptionName: string;

if (process.env.NODE_ENV === 'production') {
  rescueServiceSubscriptionName = 'mm2-rescue-service-prod';
  charLocChangeSubscriptionName = 'mm2-char-loc-change-prod';
  manaOceanSpellCastSubscriptionName = 'mm2-mana-ocean-spell-cast-prod';
  charLocChange2SubscriptionName = 'mm2-char-loc-change-prod-2';
} else {
  rescueServiceSubscriptionName = 'mm2-rescue-service-dev';
  charLocChangeSubscriptionName = 'mm2-char-loc-change-dev';
  manaOceanSpellCastSubscriptionName = 'mm2-mana-ocean-spell-cast-dev';
  charLocChange2SubscriptionName = 'mm2-char-loc-change-dev-2';
}

logger.info('pubSub subscriptions', {
  rescueServiceSubscriptionName,
  charLocChangeSubscriptionName,
  manaOceanSpellCastSubscriptionName,
  charLocChange2SubscriptionName,
});

export { 
  rescueServiceSubscriptionName,
  charLocChangeSubscriptionName,
  manaOceanSpellCastSubscriptionName,
  charLocChange2SubscriptionName,
};
