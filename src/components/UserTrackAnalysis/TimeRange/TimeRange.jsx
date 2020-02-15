import React from 'react';
import './TimeRange.css';

import * as moment from 'moment';

import { Range, getTrackBackground } from 'react-range';

// import { TimeRangePropTypes } from '../../types';

// eslint-disable-next-line max-lines-per-function
export function TimeRange(props) {
  const {
    values, onChange, max, min, step, tickStep, onFinalChange,
  } = props;

  // min
  // max
  // tickStep
  let next = min + min % tickStep;
  const ticksAbs = [];
  while (next < max) {
    ticksAbs.push(next);
    next += tickStep;
  }
  console.log(ticksAbs);
  const ticks = ticksAbs.map((tick) => (tick - min) / (max - min));
  console.log(ticks);


  return (
    <div
      className="TimeRange"
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Range
        step={step}
        min={min}
        max={max}
        values={values}
        onChange={onChange}
        onFinalChange={onFinalChange}
        // eslint-disable-next-line max-lines-per-function
        renderTrack={({ props, children }) => (
          <>
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: '36px',
                display: 'flex',
                width: '100%',
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: '5px',
                  width: '100%',
                  borderRadius: '4px',
                  background: getTrackBackground({
                    values,
                    colors: ['#ccc', '#548BF4', '#ccc'],
                    min,
                    max,
                  }),
                  alignSelf: 'center',
                }}
              >
                {children}
              </div>
            </div>
            <div
            // className
              style={{
                height: '0px',
                width: '100%',
                borderRadius: '4px',
                background: 'red',
                alignSelf: 'center',
                position: 'relative',
              }}
            >
              {
                ticks.map((tick) => (
                  <div style={{
                    height: '1rem',
                    width: '4px',
                    borderRadius: '4px',
                    background: 'rgb(84, 139, 244)',
                    alignSelf: 'center',
                    position: 'absolute',
                    left: `${tick * 100}%`,
                  }}
                  />
                ))
              }
            </div>
          </>
        )}
        renderThumb={({ index, props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '42px',
              width: '42px',
              borderRadius: '4px',
              backgroundColor: '#FFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0px 2px 6px #AAA',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-28px',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '14px',
                fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                padding: '4px',
                borderRadius: '4px',
                backgroundColor: '#548BF4',
              }}
            >
              {/* {values[index].toFixed(1)} */}
              {moment(values[index]).format('HH:mm_Do')}
              {/* {moment(values[index]).format('HH:mm')} */}
            </div>
            <div
              style={{
                height: '16px',
                width: '5px',
                backgroundColor: isDragged ? '#548BF4' : '#CCC',
              }}
            />
          </div>
        )}
        // onChange={() => ''}
        // onFinalChange={onChange}
        // renderTrack={({ props, children }) => (
        //   <div
        //   // eslint-disable-next-line react/jsx-props-no-spreading
        //     {...props}
        //     style={{
        //       ...props.style,
        //       height: '6px',
        //       width: '100%',
        //       backgroundColor: '#ccc',
        //     }}
        //   >
        //     {children}
        //   </div>
        // )}
        // renderThumb={({ props }) => (
        //   <div
        //   // eslint-disable-next-line react/jsx-props-no-spreading
        //     {...props}
        //     style={{
        //       ...props.style,
        //       height: '42px',
        //       width: '42px',
        //       backgroundColor: '#999',
        //     }}
        //   />
        // )}
      />
    </div>
  );
}

// TimeRange.propTypes = TimeRangePropTypes;
