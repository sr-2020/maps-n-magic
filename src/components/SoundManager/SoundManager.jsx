import React, { Component } from 'react';
import './SoundManager.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faPause, faMusic } from '@fortawesome/free-solid-svg-icons';

// import { SoundManagerPropTypes } from '../../types';

export class SoundManager extends Component {
  // static propTypes = SoundManagerPropTypes;

  constructor(props) {
    super(props);
    const sounds = props.soundService.getSounds();
    this.state = {
      sounds,
    };
    this.onSoundUpdate = this.onSoundUpdate.bind(this);
  }

  componentDidMount = () => {
    console.log('SoundManager mounted');

    // const { soundService } = this.props;
    this.props.soundService.on('soundsUpdate', this.onSoundUpdate);
    // soundService.getFileList().then(console.log);
  }

  onSoundUpdate() {
    // const { spirits } = this.state;
    // const newSpirits = spirits.map((spirit) => {
    //   if (changedSpirit.id !== spirit.id) {
    //     return spirit;
    //   }
    //   return changedSpirit;
    // });
    const sounds = this.props.soundService.getSounds();
    this.setState({
      sounds,
    });
  }


  componentDidUpdate = () => {
    console.log('SoundManager did update');
  }

  componentWillUnmount = () => {
    console.log('SoundManager will unmount');
  }

  render() {
    const { sounds } = this.state;
    // const { t } = this.props;

    // if (!something) {
    //   return <div> SoundManager stub </div>;
    //   // return null;
    // }
    return (
      <div className="SoundManager">
        SoundManager body
        <div className="px-3">

          {
            sounds.map((sound) => (
              <button type="button" key={sound.name} className=" rounded my-1 h-12 flex music-control-button hover:bg-gray-200 w-full">
                {/* <button className="w-12 h-12 bg-gray-300 rounded-sm ">
                  <FontAwesomeIcon size="2x" className="text-gray-600 music-icon" icon={faMusic} />
                  <FontAwesomeIcon size="2x" className="text-gray-600 play-icon" icon={faPlayCircle} />
                </button> */}
                <div className="w-10 h-10 ml-1 bg-gray-300 rounded flex icon-container">
                  <FontAwesomeIcon className="text-gray-600 music-icon m-auto text-2xl" icon={faMusic} />
                  <FontAwesomeIcon className="text-gray-600 play-icon m-auto text-2xl text-white" icon={faPlayCircle} />
                </div>
                <span className="ml-2 pt-2 font-medium">{sound.name}</span>
              </button>
            ))
          }
        </div>
      </div>
    );
  }
}
