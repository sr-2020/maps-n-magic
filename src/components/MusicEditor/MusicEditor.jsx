/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MusicEditor.css';
import * as R from 'ramda';

import { readBinaryFile } from '../../utils/fileUtils';

export default class MusicEditor extends Component {
  state = {
    bufferNames: [],
    loading: true
  };

  componentDidMount = () => {
    console.log('MusicEditor mounted');
    const { audioService } = this.props;
    audioService.isLoaded.then(() => this.setState({
      loading: false,
      bufferNames: audioService.getBuffers().map(R.prop('name'))
    }));
  }

  componentDidUpdate = () => {
    console.log('MusicEditor did update');
  }

  componentWillUnmount = () => {
    console.log('MusicEditor will unmount');
  }

  updateBufferNames = () => this.setState({
    bufferNames: this.props.audioService.getBuffers().map(R.prop('name'))
  });

  onSoundSelected = (evt) => {
    readBinaryFile(evt).then((result) => {
      this.props.audioService.addAudioFile(result).then(this.updateBufferNames);
    });
  };

  render() {
    const { loading, bufferNames } = this.state;
    const { audioService } = this.props;

    return (
      <div className="MusicEditor">
        {
          loading && 'loading'
        }
        {
          <table className="beaconTable">
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {
                bufferNames.map(bufferName => (
                  <tr>
                    <td>
                      {/* <input
                        value={bufferInfo.name}
                      /> */}
                      <span>{bufferName}</span>
                      {/* onChange={this.onBeaconChange(beacon.id, 'id')} */}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => {
                          audioService.removeSound(bufferName);
                          this.updateBufferNames();
                        }}
                      >Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => audioService.startSound(bufferName)}
                      >Play
                      </button>
                      <button
                        type="button"
                        onClick={() => audioService.stopSound(bufferName)}
                      >Stop
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        }
        <input type="file" onChange={this.onSoundSelected} />
      </div>
    );
  }
}

MusicEditor.propTypes = {
  // bla: PropTypes.string,
};

MusicEditor.defaultProps = {
  // bla: 'test',
};
