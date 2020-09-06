import React from 'react';
import './DownloadChartRow.css';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { makeFileName, str2File } from 'sr2020-mm-client-core/utils/fileUtils';
// import { DownloadChartRowPropTypes } from '../../types';

const onDownloadChart = function ({
  userName, filterChart, filterSize, percentUsage,
}) {
  const svg = document.querySelector('.chart-container svg');
  // console.log(userName, svg.outerHTML);
  const svgStr = `${svg.outerHTML.slice(0, 4)} xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ${svg.outerHTML.slice(4)}`;
  const name = [
    userName,
    '15_Sept_2019_route',
    filterChart ? (`avgFilter_${filterSize}`) : 'raw',
    `data_size_${percentUsage}_percent`,
  ].join('-');
  str2File(svgStr, makeFileName(name, 'svg', new Date()));
};

// eslint-disable-next-line max-lines-per-function
export function DownloadChartRow(props) {
  const {
    userName, filterChart, filterSize, percentUsage, showExtendedChart, onChange,
  } = props;

  return (
    <tr>
      <td colSpan="12">
        <div className="tw-text-right tw-flex tw-justify-end tw-items-center">
          <Form.Group className="tw-mr-4">
            <Form.Label>Процент показываемых точек</Form.Label>
            <Form.Control
              type="number"
              value={percentUsage}
              onChange={(e) => onChange(e, 'percentUsage')}
            />
          </Form.Group>
          <Form.Group className="tw-mr-4">
            <Form.Check
              type="checkbox"
              id="showExtendedChartInput"
              label="Расширенная область графика"
              checked={showExtendedChart}
              onChange={(e) => onChange(e, 'showExtendedChart')}
            />
          </Form.Group>
          <Form.Group className="tw-mr-4">
            <Form.Check
              type="checkbox"
              id="filterChartInput"
              label="Включить фильтр данных"
              checked={filterChart}
              onChange={(e) => onChange(e, 'filterChart')}
            />
          </Form.Group>
          <Form.Group className="tw-mr-4">
            <Form.Label>Количество точек для усреднения</Form.Label>
            <Form.Control
              type="number"
              value={filterSize}
              disabled={!filterChart}
              onChange={(e) => onChange(e, 'filterSize')}
            />
          </Form.Group>
          <Form.Group>
            <Button
              variant="primary"
              onClick={() => onDownloadChart(props)}
            >
              Скачать график
            </Button>
          </Form.Group>
        </div>

      </td>
    </tr>
  );
}

// DownloadChartRow.propTypes = DownloadChartRowPropTypes;
