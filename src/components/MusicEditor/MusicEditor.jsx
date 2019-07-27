import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MusicEditor.css';
import * as R from 'ramda';

import {
  initSound, createSource, createContext, loadBuffers
} from '../../utils/audioDataUtils';

const BUFFERS_TO_LOAD = {
  // kick: 'sounds/kick.wav',
  // snare: 'sounds/snare.wav',
  // hihat: 'sounds/hihat.wav',
  // jam: 'sounds/br-jam-loop.wav',
  // crowd: 'sounds/clapping-crowd.wav',
  drums: 'sounds/stargazer.mp3',
  organ: 'sounds/nightwalker.mp3',
  techno: 'sounds/BoxCat_Games_-_10_-_Epic_Song.mp3'
  // drums: 'sounds/blueyellow.wav',
  // organ: 'sounds/organ-echo-chords.wav',
  // techno: 'sounds/techno.wav'
};

const context = createContext();

export default class MusicEditor extends Component {
  state = {
    buffers: [],
    loading: true
  };

  componentDidMount = () => {
    console.log('MusicEditor mounted');
    // this.getStateInfo();
    const buffers = [];
    loadBuffers(BUFFERS_TO_LOAD, buffers, context, () => {
      this.setState({
        buffers,
        loading: false
      });
    });
  }

  componentDidUpdate = () => {
    console.log('MusicEditor did update');
  }

  componentWillUnmount = () => {
    console.log('MusicEditor will unmount');
  }

  // getStateInfo = () => {
  //   const { dbms } = this.props;
  //   Promise.all([
  //     dbms.getSomething(),
  //   ]).then((results) => {
  //     const [something] = results;
  //     this.setState({
  //       something
  //     });
  //   });
  // }

  render() {
    const { buffers, loading } = this.state;
    // //const { t } = this.props;

    // if (!something) {
    //   return <div> MusicEditor stub </div>;
    //   // return null;
    // }
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
                buffers.map(bufferInfo => (
                  <tr>
                    <td>
                      <input
                        value={bufferInfo.name}
                      />
                      {/* onChange={this.onBeaconChange(beacon.id, 'id')} */}
                    </td>
                    {/* <td>
                      <input value={beacon.x} type="number" onChange={this.onBeaconChange(beacon.id, 'x')} />
                    </td>
                    <td>
                      <input value={beacon.y} type="number" onChange={this.onBeaconChange(beacon.id, 'y')} />
                    </td> */}
                    <td>
                      <button
                        type="button"
                      >Remove
                      </button>
                      {/* onClick={this.onBeaconRemove(beacon.id)} */}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        }
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
