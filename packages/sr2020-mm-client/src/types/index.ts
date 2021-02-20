export interface UserRecord {
  // created_at: "2020-05-03 07:58:52"
  // id: 10207
  id: number;
  // location: null
  // location_id: null
  location_id: number;
  // location_updated_at: "2020-05-03 07:58:52"
  // name: ""
  name: string;
  // updated_at: "2020-05-03 07:58:52"
};

export interface BeaconRecord {
  // bssid: "DF:8C:6D:50:E0:16"
  // id: 34
  // label: "Нджин"
  // lat: null
  // lng: null
  // location_id: null
  // ssid: "DF:8C:6D:50:E0:16"
}

export interface LocationRecord {
  // beacons: [{id: 4, ssid: "EA:93:BA:E7:99:82", bssid: "EA:93:BA:E7:99:82", location_id: 3215,…},…]
  // 0: {id: 4, ssid: "EA:93:BA:E7:99:82", bssid: "EA:93:BA:E7:99:82", location_id: 3215,…}
  // 1: {id: 16, ssid: "C1:22:25:79:BF:01", bssid: "C1:22:25:79:BF:01", location_id: 3215,…}
  // 2: {id: 12, ssid: "FE:7B:B7:53:58:CB", bssid: "FE:7B:B7:53:58:CB", location_id: 3215, label: "Рубикон",…}
  // id: 3215
  id: number;
  // label: "Межрайонье 1"
  label: string;
  // layer_id: 1
  // options: {color: "#3388ff", weight: 3, fillOpacity: 0.2, manaLevel: 6, effectList: []}
  // color: "#3388ff"
  // effectList: []
  // fillOpacity: 0.2
  // manaLevel: 6
  // weight: 3
  // polygon: {,…}
  // 0: [{lat: 54.929353280120615, lng: 36.87302201994499}, {lat: 54.9291853949252, lng: 36.873314380727614},…]
}

export interface SoundStageData {
  backgroundSound: string;
  rotationSounds: string[];
  rotationTimeout: number;
  rotationSoundTimeout: number;
  backgroundVolume: number;
  rotationVolume: number;
}

export type ShuffleFunction = <T>(array: T[]) => T[];

export interface Sound {
  name: string;
  hash: string;
  size: number;
  status: string;
  buffer?: AudioBuffer;
}

export interface SoundCtl {
  source: AudioBufferSourceNode & { 
    customData?: any, 
    noteOn?: any ,
    noteOff?: any
  };
  gainNode: GainNode
};