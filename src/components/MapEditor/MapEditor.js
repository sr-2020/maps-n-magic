import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MapEditor.css';

// import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import MainPolygon from '../MainPolygon';

import Map from '../Map';

// const SVG_WIDTH = 500;
// const SVG_HEIGHT = 400;

export default class MapEditor extends Component {
  state = {
  };

  onFileUpload = (evt) => {
    const {
      setImageUrl
    } = this.props;
    console.log(evt);
    const f = evt.target.files[0];

    if (f) {
      const r = new FileReader();
      r.onload = (e) => {
        const contents = e.target.result;
        // console.log(contents);
        setImageUrl(contents);
        // try {
        //   const object = JSON.parse(contents);
        //   // resolve(object);
        // } catch (err) {
        //   // reject(err);
        // }
      };
      r.readAsDataURL(f);
    } else {
      // UI.alert(L10n.getValue('utils-base-file-loading-error'));
      // reject(new Error('utils-base-file-loading-error'));
    }
  }

  render() {
    const {
      imagePositionX, imagePositionY, imageOpacity, imageScale, svgWidth, svgHeight, onPropChange, mainPolygon,
      imageUrl, toDefaultImageUrl
    } = this.props;

    return (
      <div className="MapEditor flex-row justify-content-center">
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
              <Form.Label>image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={this.onFileUpload}
                // onChange={onPropChange('imageOpacity')}
                // placeholder="imageOpacity"
                // value={imageOpacity}
              />
            </Form.Group>
          </Row>
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
          <Button onClick={toDefaultImageUrl}>Set default image</Button>

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
          imageUrl={imageUrl}
        >
          <MainPolygon mainPolygon={mainPolygon} />
        </Map>
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
