import React, { Component } from 'react';
import './SoundMapper.css';

import { MusicSelectControl } from '../MusicSelectControl';

// import { SoundMapperPropTypes } from '../../types';

export class SoundMapper extends Component {
  // static propTypes = SoundMapperPropTypes;

  constructor(props) {
    super(props);
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
    const { gameModel } = this.props;
    return (
      <div className="SoundMapper">
        <MusicSelectControl gameModel={gameModel} />
      </div>
    );
  }
}
