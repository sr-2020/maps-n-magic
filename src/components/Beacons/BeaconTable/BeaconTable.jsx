import React, { Component } from 'react';
import './BeaconTable.css';
import * as R from 'ramda';
import { BeaconTablePropTypes } from '../../../types';

// class BeaconTable extends Component {
// eslint-disable-next-line max-lines-per-function
export function BeaconTable(props) {
  const {
    audioService, beacons, onTableHover, onBeaconChange, onBeaconPropChange, onBeaconPropCheckboxChange,
    onBeaconRemove
  } = props;
  return (
    <table className="beaconTable">
      <thead>
        <tr>
          <th>№</th>
          <th>id</th>
          <th>x</th>
          <th>y</th>
          <th>sound</th>
          <th>fix position</th>
        </tr>
      </thead>
      <tbody>
        {
          beacons.map((beacon, i) => (
            // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
            <tr key={beacon.id} onMouseOver={onTableHover(beacon.id)}>
              <td>{i + 1}</td>
              <td>
                <input value={beacon.id} onChange={onBeaconChange(beacon.id, 'id')} />
              </td>
              <td>
                <input className="coordInput" value={beacon.x} type="number" onChange={onBeaconChange(beacon.id, 'x')} />
              </td>
              <td>
                <input className="coordInput" value={beacon.y} type="number" onChange={onBeaconChange(beacon.id, 'y')} />
              </td>

              <td>
                <select value={beacon.props.sound} onChange={onBeaconPropChange(beacon.id, 'sound')}>
                  {
                    ['none'].concat(audioService.getSoundNames()).map((soundName) => <option key={soundName} value={soundName}>{soundName}</option>)
                  }
                </select>
                {/* onChange={this.onBeaconChange(beacon.id, 'y')}  */}
              </td>
              <td>
                <input
                  type="checkbox"
                  onChange={onBeaconPropCheckboxChange(beacon.id, 'positionFixed')}
                  checked={beacon.props.positionFixed}
                />
              </td>
              <td>
                <button type="button" onClick={onBeaconRemove(beacon.id)}>Remove</button>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}

BeaconTable.propTypes = BeaconTablePropTypes;
