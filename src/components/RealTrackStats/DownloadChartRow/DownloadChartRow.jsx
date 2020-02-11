import React from 'react';
import './DownloadChartRow.css';

import Button from 'react-bootstrap/Button';

import { makeFileName, str2File } from '../../../utils/fileUtils';
// import { DownloadChartRowPropTypes } from '../../types';

const onDownloadChart = function (userName) {
  const svg = document.querySelector('.chart-container svg');
  console.log(userName, svg.outerHTML);
  const svgStr = `${svg.outerHTML.slice(0, 4)} xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ${svg.outerHTML.slice(4)}`;
  str2File(svgStr, makeFileName(`${userName}_15_Sept_2019_route`, 'svg', new Date()));
};

export function DownloadChartRow(props) {
  const { userName } = props;

  return (
    <tr>
      <td colSpan="12">
        <div className="text-right">

          <Button
            variant="primary"
            onClick={() => onDownloadChart(userName)}
          >
            Скачать график
          </Button>
        </div>

      </td>
    </tr>
  );
}

// DownloadChartRow.propTypes = DownloadChartRowPropTypes;
