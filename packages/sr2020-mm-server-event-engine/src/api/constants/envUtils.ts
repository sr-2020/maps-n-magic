export interface EnvVariables {
  values: Record<string, string>; 
  missedValues: string[]; 
  secrets: string[]; 
}

export function getEnvVariables(constList: string[], secrets: string[]): EnvVariables {
  return constList.reduce((acc: EnvVariables, name) => {
    const value = process.env[name];
    if (value != null) {
      acc.values[name] = value;
    } else {
      acc.missedValues.push(name);
    }
    return acc;
  }, {
    values: {},
    missedValues: [],
    secrets
  });
}

export function getPrintObject(envVariables: EnvVariables): Record<string, string> {
  const { values, secrets } = envVariables;
  return Object.entries(values).reduce((acc: Record<string, string>, [key, value]) => {
    if (secrets.includes(key)) {
      acc[key] = '<not empty>';
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
}

export function mergeEnvVariables(
  envVariables1: EnvVariables, 
  envVariables2: EnvVariables
): EnvVariables {
  return {
    missedValues: [...envVariables1.missedValues, ...envVariables2.missedValues],
    secrets: [...envVariables1.secrets, ...envVariables2.secrets],
    values: {...envVariables1.values, ...envVariables2.values},
  }
}