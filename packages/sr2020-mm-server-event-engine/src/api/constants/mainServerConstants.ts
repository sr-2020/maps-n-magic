import assert from "assert";
import { createLogger } from "../../logger";
import { getEnvVariables, getPrintObject, mergeEnvVariables } from "./envUtils";
import { GenericServerConstants, getGenericEnvVariables, getGenericServerConstants } from "./genericServerConstants";

const logger = createLogger('mainServerConstants');

interface MainServerConstants extends GenericServerConstants {
  beaconsUrl: string;
  locationsUrl: string;
  usersUrl: string;
  positionUrl: string;
  billingInsurance: string;
  pushServiceUrl: string;
  featuresUrl: string;
};

let constantsInstance: MainServerConstants | null = null;

enum MainServerConstant {
  'POSITION_URL' = 'POSITION_URL',
  'BILLING_URL' = 'BILLING_URL',
  'PUSH_URL' = 'PUSH_URL',
  'MODEL_ENGINE_URL' = 'MODEL_ENGINE_URL',
  'DROPBOX_TOKEN' = 'DROPBOX_TOKEN',
  'PGHOST' = 'PGHOST',
  'PGUSER' = 'PGUSER',
  'PGDATABASE' = 'PGDATABASE',
  'PGPASSWORD' = 'PGPASSWORD',
  'PGPORT' = 'PGPORT',
}

export function mainServerConstants(): MainServerConstants {
  if (constantsInstance === null) {

    const mainEnvVariables = mergeEnvVariables(
      getGenericEnvVariables(),
      getEnvVariables(Object.values(MainServerConstant), [
        'DROPBOX_TOKEN',
        'PGPASSWORD'
      ])
    );
    const { values } = mainEnvVariables;
    if (mainEnvVariables.missedValues.length > 0) {
      throw new Error(`Missed env params ${JSON.stringify(mainEnvVariables.missedValues)}`);
    }

    const printObject = getPrintObject(mainEnvVariables);

    logger.info("MainServerConstants", printObject);
    
    constantsInstance = {
      ...getGenericServerConstants(mainEnvVariables),
      beaconsUrl:   values[MainServerConstant.POSITION_URL] + '/api/v1/beacons',
      locationsUrl: values[MainServerConstant.POSITION_URL] + '/api/v1/locations',
      usersUrl:     values[MainServerConstant.POSITION_URL] + '/api/v1/users',
      positionUrl:  values[MainServerConstant.POSITION_URL] + '/api/v1/positions',
      billingInsurance: values[MainServerConstant.BILLING_URL]  + '/insurance/getinsurance',
      pushServiceUrl: values[MainServerConstant.PUSH_URL] + '/send_notification',
      featuresUrl: values[MainServerConstant.MODEL_ENGINE_URL] + '/features',
    }
  }

  assert(constantsInstance !== null);
  // logger.info('constantsInstance', constantsInstance);
  return constantsInstance;
}
