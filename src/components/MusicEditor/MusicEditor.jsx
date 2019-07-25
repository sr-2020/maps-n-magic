import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MusicEditor.css';

export default class MusicEditor extends Component {
  state = {
  };

  componentDidMount = () => {
    console.log('MusicEditor mounted');
	// this.getStateInfo();
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
    const { something } = this.state;
	//const { t } = this.props;

    if (!something) {
      return <div> MusicEditor stub </div> ;
	  // return null;
    }
    return (
      <div className="MusicEditor">
        MusicEditor body
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
