import React, { Component } from 'react';
import './BeaconTable.css';
import * as R from 'ramda';

export default class BeaconTable extends Component {
  state = {
  };

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      audioService, beacons, onTableHover, onBeaconChange, onBeaconPropChange, onBeaconPropCheckboxChange,
      onBeaconRemove
    } = this.props;
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
              <tr onMouseOver={onTableHover(beacon.id)}>
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
                      ['none'].concat(audioService.getBuffers().map(R.prop('name'))).map(soundName => <option value={soundName}>{soundName}</option>)
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
}
