import React, { Component } from 'react';
import './FractionList.css';

import * as R from 'ramda';

import { FractionListPropTypes } from '../../../types';

const sort = R.sortBy(R.toLower);

export class FractionList extends Component {
  static propTypes = FractionListPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      fractions: [],
    };
    this.onFractionChange = this.onFractionChange.bind(this);
  }

  componentDidMount = () => {
    const { spiritService } = this.props;
    // const fractions = spiritService.getSpiritFractionsList();
    const fractions = spiritService.get('spiritFractionsList');
    this.setState({
      fractions: sort(fractions),
    });
    console.log('FractionList mounted');
    this.props.spiritService.on('fractionChange', this.onFractionChange);
  }

  componentDidUpdate = (prevProps) => {
    console.log('FractionList did update');
    if (prevProps.spiritService === this.props.spiritService) {
      return;
    }
    this.onUpdate(prevProps);
  }

  onUpdate(prevProps) {
    prevProps.spiritService.off('fractionChange', this.onFractionChange);

    const { spiritService } = this.props;
    // const fractions = spiritService.getSpiritFractionsList();
    const fractions = spiritService.get('spiritFractionsList');
    this.setState({
      fractions: sort(fractions),
    });
    spiritService.on('fractionChange', this.onFractionChange);
  }

  componentWillUnmount = () => {
    console.log('FractionList will unmount');
    this.props.spiritService.off('fractionChange', this.onFractionChange);
  }

  onFractionChange({ fractions }) {
    // const { spirits } = this.state;
    // const newSpirits = spirits.map((spirit) => {
    //   if (changedSpirit.id !== spirit.id) {
    //     return spirit;
    //   }
    //   return changedSpirit;
    // });

    this.setState({
      fractions: sort(fractions),
    });
  }

  render() {
    const { fractions } = this.state;
    return (
      <datalist className="FractionList" id="fraction-datalist">
        {
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
          fractions.map((fraction) => <option key={fraction} value={fraction} />)
        }
      </datalist>
    );
  }
}
