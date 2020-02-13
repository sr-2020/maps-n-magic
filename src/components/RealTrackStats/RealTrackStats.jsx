import React, { Component } from 'react';
import './RealTrackStats.css';
import * as R from 'ramda';

import Table from 'react-bootstrap/Table';

import tracksData from '../../dataAnalysis/data/pt6.json';
import beaconLatlngs from '../../dataAnalysis/data/googleMapBeaconList.json';

import { TableHead } from './TableHead';
import { StatsRow } from './StatsRow';
import { DownloadChartRow } from './DownloadChartRow';
import { ScatterRow } from './ScatterRow';

const beaconLatlngsIndex = R.indexBy(R.prop('id'), beaconLatlngs);

// import { RealTrackStatsPropTypes } from '../../types';

export class RealTrackStats extends Component {
  // static propTypes = RealTrackStatsPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      selectedRow: 6,
      filterChart: true,
      filterSize: 20,
      percentUsage: 1,
      showExtendedChart: true,
    };
    this.onChange = this.onChange.bind(this);
  }

  onSelectRow(index) {
    this.setState({
      selectedRow: index,
    });
  }

  onChange(e, name) {
    // filterChart, filterSize, percentUsage, showExtendedChart,
    if (name === 'filterChart' || name === 'showExtendedChart') {
      this.setState({
        [name]: e.target.checked,
      });
    }
    if (name === 'percentUsage' || name === 'filterSize') {
      const upperLimit = name === 'percentUsage' ? 100 : 500;
      let value = Number(e.target.value);
      if (value < 1) {
        value = 1;
      }
      if (value > upperLimit) {
        value = upperLimit;
      }
      this.setState({
        [name]: value,
      });
    }
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      selectedRow, filterChart, filterSize, percentUsage, showExtendedChart,
    } = this.state;

    const sortByTotal = R.sortBy((el) => -el.stats.total);
    return (
      <div className="RealTrackStats mx-auto p-4">
        <Table
          bordered
          hover
          size="sm"
        >
          <TableHead />
          <tbody>
            {
              sortByTotal(Object.values(tracksData)).map((trackData, index) => (
                <>
                  <StatsRow trackData={trackData} onSelectRow={() => this.onSelectRow(index)} />
                  {
                    ((index === selectedRow) || false) && (
                      <>
                        <ScatterRow
                          trackData={trackData}
                          beaconLatlngsIndex={beaconLatlngsIndex}
                          filterChart={filterChart}
                          filterSize={filterSize}
                          percentUsage={percentUsage}
                          showExtendedChart={showExtendedChart}
                        />
                        <DownloadChartRow
                          userName={trackData.userData.name}
                          filterChart={filterChart}
                          filterSize={filterSize}
                          percentUsage={percentUsage}
                          showExtendedChart={showExtendedChart}
                          onChange={this.onChange}
                        />
                      </>
                    )
                  }
                </>
              ))
            }
          </tbody>
        </Table>
      </div>
    );
  }
}
