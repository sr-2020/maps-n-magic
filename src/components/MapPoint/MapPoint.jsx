import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MapPoint.css';

export default class MapPoint extends Component {
  state = {
  };

  componentDidMount = () => {
    console.log('MapPoint mounted');
    // this.getStateInfo();
  }

  componentDidUpdate = () => {
    console.log('MapPoint did update');
  }

  componentWillUnmount = () => {
    console.log('MapPoint will unmount');
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
    // const { something } = this.state;
    const { x, y, fill } = this.props;

    // if (!something) {
    //   return <div> MapPoint stub </div> ;
	  // // return null;
    // }
    return (
      <circle r="2" cx={x} cy={y} fill={fill || 'red'} />
    );
  }
}

MapPoint.propTypes = {
  // bla: PropTypes.string,
};

MapPoint.defaultProps = {
  // bla: 'test',
};
