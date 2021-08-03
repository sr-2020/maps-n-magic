import assert from "assert";
import { createLogger } from "../../utils";
import { getEnvVariables, getPrintObject, mergeEnvVariables } from "./envUtils";
import { GenericServerConstants, getGenericEnvVariables, getGenericServerConstants } from "./genericServerConstants";

const logger = createLogger('mainServerConstants.ts');

interface MainServerConstants extends GenericServerConstants {
  beaconsUrl: string;
  locationsUrl: string;
  usersUrl: string;
  positionUrl: string;
  billingInsurance: string;
  pushServiceUrl: string;
  featuresUrl: string;
  EMERCOM_PASSWORD: string;
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
  'EMERCOM_PASSWORD' = 'EMERCOM_PASSWORD',
}

export function mainServerConstants(): MainServerConstants {
  if (constantsInstance === null) {

    const mainEnvVariables = mergeEnvVariables(
      getGenericEnvVariables(),
      getEnvVariables(Object.values(MainServerConstant), [
        'DROPBOX_TOKEN',
        'PGPASSWORD',
        'EMERCOM_PASSWORD'
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
      EMERCOM_PASSWORD: values[MainServerConstant.EMERCOM_PASSWORD],
    }
  }

  assert(constantsInstance !== null);
  // logger.info('constantsInstance', constantsInstance);
  return constantsInstance;
}
