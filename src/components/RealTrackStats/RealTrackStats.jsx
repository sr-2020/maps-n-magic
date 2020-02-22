import React, { Component } from 'react';
import './RealTrackStats.css';
import * as R from 'ramda';

import Table from 'react-bootstrap/Table';

import { TableHead } from './TableHead';
import { StatsRow } from './StatsRow';
import { DownloadChartRow } from './DownloadChartRow';
import { ScatterRow } from './ScatterRow';

// import { RealTrackStatsPropTypes } from '../../types';

export class RealTrackStats extends Component {
  // static propTypes = RealTrackStatsPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      selectedRow: null,
      filterChart: true,
      filterSize: 20,
      percentUsage: 1,
      showExtendedChart: true,
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    const {
      initialPercentUsage, initialShowExtendedChart,
    } = this.props;
    if (initialPercentUsage !== undefined) {
      this.setState({
        percentUsage: initialPercentUsage,
      });
    }
    if (initialShowExtendedChart !== undefined) {
      this.setState({
        showExtendedChart: initialShowExtendedChart,
      });
    }
  }

  onSelectRow(index) {
    this.setState(({ selectedRow }) => ({
      selectedRow: selectedRow === index ? null : index,
    }));
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
    const {
      tracksData, beaconLatlngsIndex, beaconIndex,
    } = this.props;

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
                          beaconIndex={beaconIndex}
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
