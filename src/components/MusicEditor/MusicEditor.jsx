import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MusicEditor.css';
import * as R from 'ramda';

import AudioService from '../../services/audioService';

import { readBinaryFile } from '../../utils/fileUtils';

export default class MusicEditor extends Component {
  state = {
    bufferNames: [],
    loading: true
  };

  audioService = new AudioService();

  componentDidMount = () => {
    console.log('MusicEditor mounted');
    this.audioService.isLoaded.then(() => this.setState({
      loading: false,
      bufferNames: this.audioService.getBuffers().map(R.prop('name'))
    }));
  }

  componentDidUpdate = () => {
    console.log('MusicEditor did update');
  }

  componentWillUnmount = () => {
    console.log('MusicEditor will unmount');
  }

  updateBufferNames = () => this.setState({
    bufferNames: this.audioService.getBuffers().map(R.prop('name'))
  });

  onSoundSelected = (evt) => {
    readBinaryFile(evt).then((result) => {
      this.audioService.addAudioFile(result).then(this.updateBufferNames);
    });
  };

  render() {
    const { loading, bufferNames } = this.state;

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
                          this.audioService.removeSound(bufferName);
                          this.updateBufferNames();
                        }}
                      >Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => this.audioService.startSound(bufferName)}
                      >Play
                      </button>
                      <button
                        type="button"
                        onClick={() => this.audioService.stopSound(bufferName)}
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
