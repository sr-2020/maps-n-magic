/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import './MusicEditor.css';
import * as R from 'ramda';

import { readBinaryFile } from '../../utils/fileUtils';
// import { MusicEditorPropTypes } from '../../types';

export class MusicEditor extends Component {
  // static propTypes = MusicEditorPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      buffers: [],
      loading: true,
    };
  }

  componentDidMount = () => {
    const { audioService } = this.props;
    audioService.isLoaded.then(() => this.setState({
      loading: false,
      buffers: this.getBuffers(),
    }));
  }

  getBuffers = () => this.props.audioService.getBuffers().map(R.pick(['name', 'props']));

  updateBufferNames = () => this.setState({
    buffers: this.getBuffers(),
  });

  onSoundSelected = (evt) => {
    readBinaryFile(evt).then((result) => {
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
                buffers.map((buffer) => (
                  <tr key={buffer.name}>
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
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => audioService.startSound(buffer.name)}
                      >
                        Play
                      </button>
                      <button
                        type="button"
                        onClick={() => audioService.stopSound(buffer.name)}
                      >
                        Stop
                      </button>
                      <input
                        type="color"
                        defaultValue={buffer.props.color}
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
