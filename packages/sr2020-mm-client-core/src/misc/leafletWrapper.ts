// Webpack adds separate leaflet instance from every monorepo rep.
// Leaflet adds itself to window and overwrite itself.
// So it caused if it:
// 1. Load leaflet
// 2. Load geoman
// 3. Load leaflet - it forgets about geoman and geoman scripts still in memory.
//
// Initially it was working because of hoisting and there were only one leaflet instance.
// But this mode is broken because it runs several React instances.
//
// So this is hack to have only one leaflet instance in client-core and
// remove leaflet dependency from client.

// import L from 'leaflet/dist/leaflet-src';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

export { L };
