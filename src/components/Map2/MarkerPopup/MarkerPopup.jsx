import React, { Component } from 'react';
import './MarkerPopup.css';

export default class MarkerPopup extends Component {
  state = {
    name: null,
    lat: null,
    lng: null
  };

  componentDidMount = () => {
    console.log('MarkerPopup mounted');
    // const { name, lat, lng } = this.props;
    // this.setState({
    //   name, lat, lng
    // });
    // this.getStateInfo();
  }

  componentDidUpdate = () => {
    console.log('MarkerPopup did update');
  }

  componentWillUnmount = () => {
    console.log('MarkerPopup will unmount');
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

  _handleKeyDown = e => {
    console.log('do validate');
    if (e.key === 'Enter') {
      this.props.onClose();
    }
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      name, lat, lng, onChange
    } = this.props;
    //const { t } = this.props;

    // if (!something) {
    //   return <div> MarkerPopup stub </div>;
    //   // return null;
    // }
    return (
      <div className="MarkerPopup">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="markerName"
          >Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="markerName"
            type="text"
            value={name}
            onChange={onChange('name')}
            onKeyPress={this._handleKeyDown}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="markerLat"
          >Latitude
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="markerLat"
            type="text"
            value={lat}
            onChange={onChange('lat')}
            onKeyPress={this._handleKeyDown}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="markerLng"
          >Longitude
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="markerLng"
            type="text"
            value={lng}
            onChange={onChange('lng')}
            onKeyPress={this._handleKeyDown}
          />
        </div>
      </div>
    );
  }
}
