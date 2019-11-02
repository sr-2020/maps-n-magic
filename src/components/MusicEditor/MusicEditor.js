/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MusicEditor.css';
import * as R from 'ramda';

import { readBinaryFile } from '../../utils/fileUtils';

export default class MusicEditor extends Component {
  state = {
    buffers: [],
    loading: true
  };

  componentDidMount = () => {
    console.log('MusicEditor mounted');
    const { audioService } = this.props;
    audioService.isLoaded.then(() => this.setState({
      loading: false,
      buffers: this.getBuffers()
    }));
  }

  componentDidUpdate = () => {
    console.log('MusicEditor did update');
  }

  componentWillUnmount = () => {
    console.log('MusicEditor will unmount');
  }

  getBuffers = () => this.props.audioService.getBuffers().map(R.pick(['name', 'props']));

  updateBufferNames = () => this.setState({
    buffers: this.getBuffers()
  });

  onSoundSelected = evt => {
    readBinaryFile(evt).then(result => {
      this.props.audioService.addAudioFile(result).then(this.updateBufferNames);
    });
  };

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { loading, buffers } = this.state;
    const { audioService } = this.props;

    return (
      <div className="MusicEditor  margin-2rem">
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
                buffers.map(buffer => (
                  <tr>
                    <td>
                      {/* <input
                        value={bufferInfo.name}
                      /> */}
                      <span>{buffer.name}</span>
                      {/* onChange={this.onBeaconChange(beacon.id, 'id')} */}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => {
                          audioService.removeSound(buffer.name);
                          this.updateBufferNames();
                        }}
                      >Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => audioService.startSound(buffer.name)}
                      >Play
                      </button>
                      <button
                        type="button"
                        onClick={() => audioService.stopSound(buffer.name)}
                      >Stop
                      </button>
                      <input
                        type="color"
                        value={buffer.props.color}
                      />
                      {/* // onClick={() => audioService.stopSound(bufferName)} */}
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
