import React from 'react';
import './PolygonTable.css';
import { PolygonTablePropTypes } from '../../../types';

export function PolygonTable(props) {
  const { mainPolygon, onPointChange } = props;
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
            // eslint-disable-next-line react/no-array-index-key
            <tr key={i}>
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

PolygonTable.propTypes = PolygonTablePropTypes;
