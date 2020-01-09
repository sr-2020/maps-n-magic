import React, { Component } from 'react';
import './SoundMapper.css';

import { MusicSelectControl } from '../MusicSelectControl';

// import { SoundMapperPropTypes } from '../../types';

export class SoundMapper extends Component {
  // static propTypes = SoundMapperPropTypes;

  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount = () => {
    console.log('SoundMapper mounted');
  }

  componentDidUpdate = () => {
    console.log('SoundMapper did update');
  }

  componentWillUnmount = () => {
    console.log('SoundMapper will unmount');
  }

  render() {
    const { soundService } = this.props;
    // const { t } = this.props;

    // if (!something) {
    //   return <div> SoundMapper stub </div>;
    //   // return null;
    // }
    return (
      <div className="SoundMapper">
        <MusicSelectControl soundService={soundService} />
      </div>
    );
  }
}
