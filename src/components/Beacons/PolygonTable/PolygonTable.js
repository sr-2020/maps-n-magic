import React, { Component } from 'react';
import './PolygonTable.css';

export default class PolygonTable extends Component {
  state = {
  };

  render() {
    const { mainPolygon, onPointChange } = this.props;
    return (
      <table className="beaconTable">
        <thead>
          <tr>
            <th>№</th>
            <th>x</th>
            <th>y</th>
          </tr>
        </thead>
        <tbody>
          {
            mainPolygon.map((point, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>
                  <input className="coordInput" value={point[0]} type="number" onChange={onPointChange(i, 0)} />
                </td>
                <td>
                  <input className="coordInput" value={point[1]} type="number" onChange={onPointChange(i, 1)} />
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  }
}
