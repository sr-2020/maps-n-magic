import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MapEditor.css';

// import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Map from '../Map';

// const SVG_WIDTH = 500;
// const SVG_HEIGHT = 400;

export default class MapEditor extends Component {
  state = {
    svgWidth: 800,
    svgHeight: 581,
    imagePositionX: 50,
    imagePositionY: 68,
    imageOpacity: 70,
    imageScale: 800
  };

  componentDidMount = () => {
    console.log('MapEditor mounted');
    // this.getStateInfo();
  }

  componentDidUpdate = () => {
    console.log('MapEditor did update');
  }

  componentWillUnmount = () => {
    console.log('MapEditor will unmount');
  }

  // onStateChange = prop => (e) => {
  //   this.setState({
  //     [prop]: e.target.value
  //   });
  // }

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
    const {
      imagePositionX, imagePositionY, imageOpacity, imageScale, svgWidth, svgHeight, onPropChange
    } = this.props;
    // // const {
    // //   imagePositionX, imagePositionY, imageOpacity, imageScale, svgWidth, svgHeight
    // // } = this.state;
    // //const { t } = this.props;

    // // if (!something) {
    // //   return <div> MapEditor stub </div>;
    // //   // return null;
    // // }
    // const imageStyle = {
    //   background: `linear-gradient(to bottom,
    //                 rgba(255,255,255,${imageOpacity / 100}) 0%,
    //                 rgba(255,255,255,${imageOpacity / 100}) 100%),
    //                 url(/images/backgroundImage.jpg) no-repeat ${imagePositionX}% ${imagePositionY}% / ${imageScale}px auto`,
    //   // backgroundSize: `${imageScale}% auto`,
    //   // backgroundPosition: `${imagePositionX}% ${imagePositionY}%`
    // };
    // const imageStyle = {
    //   background: `linear-gradient(to bottom, rgba(255,255,255,${imageOpacity / 100}) 0%,rgba(255,255,255,${imageOpacity / 100}) 100%), url(/images/backgroundImage.jpg) no-repeat`,
    //   backgroundSize: `${imageScale}% auto`,
    //   backgroundPosition: `${imagePositionX}% ${imagePositionY}%`
    // };

    return (
      <div className="MapEditor flex-row justify-content-center">
        {/* onMouseMove={this.moveMovable}
        onClick={this.setMovable(null)} */}
        <Form className="margin-2rem">
          <h3>Canvas parameters</h3>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>svgWidth, px</Form.Label>
              <Form.Control
                type="number"
                onChange={onPropChange('svgWidth')}
                placeholder="svgWidth"
                value={svgWidth}
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>svgHeight, px</Form.Label>
              <Form.Control
                type="number"
                onChange={onPropChange('svgHeight')}
                placeholder="svgHeight"
                value={svgHeight}
              />
            </Form.Group>
          </Row>
          <h3>Background parameters</h3>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>imagePositionX, %</Form.Label>
              <Form.Control
                type="number"
                onChange={onPropChange('imagePositionX')}
                placeholder="imagePositionX"
                value={imagePositionX}
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>imagePositionY, %</Form.Label>
              <Form.Control
                type="number"
                onChange={onPropChange('imagePositionY')}
                placeholder="imagePositionY"
                value={imagePositionY}
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>imageWidth, px</Form.Label>
              <Form.Control
                type="number"
                onChange={onPropChange('imageScale')}
                placeholder="imageScale"
                value={imageScale}
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>imageOpacity, %</Form.Label>
              <Form.Control
                type="number"
                onChange={onPropChange('imageOpacity')}
                placeholder="imageOpacity"
                value={imageOpacity}
              />
            </Form.Group>
          </Row>
        </Form>
        {/* <svg
          className="root-image"
          width={svgWidth}
          height={svgHeight}
          xmlns="http://www.w3.org/2000/svg"
          style={imageStyle}
        /> */}
        <Map
          className="margin-2rem"
          imagePositionX={imagePositionX}
          imagePositionY={imagePositionY}
          imageOpacity={imageOpacity}
          imageScale={imageScale}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
        />
      </div>
    );
  }
}

MapEditor.propTypes = {
  // bla: PropTypes.string,
};

MapEditor.defaultProps = {
  // bla: 'test',
};
