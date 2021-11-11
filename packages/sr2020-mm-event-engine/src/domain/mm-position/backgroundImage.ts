import Ajv, { JSONSchemaType } from "ajv";

export interface BackgroundImage {
  latlngs: L.LatLngLiteral[][];
  image: string;
  id: number;
  name: string;
}

export const defaultBackgroundImage: Omit<BackgroundImage, 'id'> = {
  latlngs: [],
  image: 'images/noImage.svg',
  name: 'Image'
};

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

const backgroundImageSchema: JSONSchemaType<BackgroundImage> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    name: {type: "string"},
    image: {type: "string"},
    latlngs: {
      type: "array",
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['lat', 'lng'],
          properties: {
            lat: {type: 'number'},
            lng: {type: 'number'}
          }
        }
      }
    },
  },
  required: [
    "name", 
    "id", 
    "image", 
    "latlngs", 
  ],
  additionalProperties: false,
};

export const validateBackgroundImage = ajv.compile(backgroundImageSchema);

const newBackgroundImageSchema: JSONSchemaType<Omit<BackgroundImage, "id">> = {
  type: "object",
  properties: {
    name: {type: "string"},
    image: {type: "string"},
    latlngs: {
      type: "array",
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['lat', 'lng'],
          properties: {
            lat: {type: 'number'},
            lng: {type: 'number'}
          }
        }
      }
    },
  },
  required: [
    "name", 
    "image", 
    "latlngs", 
  ],
  additionalProperties: false,
};

export const validateNewBackgroundImage = ajv.compile(newBackgroundImageSchema);

export function fillNewBackgroundImage(backgroundImage: Partial<Omit<BackgroundImage, "id">>): Omit<BackgroundImage, "id"> {
  return {
    ...defaultBackgroundImage,
    ...backgroundImage
  };
}
