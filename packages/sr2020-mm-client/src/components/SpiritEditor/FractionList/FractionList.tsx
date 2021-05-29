export {};
// import React, { Component } from 'react';
// import './FractionList.css';

// import * as R from 'ramda';

// import { GameModel } from "sr2020-mm-event-engine";

// const sort = R.sortBy(R.toLower);

// interface FractionListProps {
//   spiritService: GameModel;
// }
// interface FractionListState {
//   fractions: string[];
// }

// export class FractionList extends Component<FractionListProps, FractionListState> {
//   constructor(props: FractionListProps) {
//     super(props);
//     this.state = {
//       fractions: [],
//     };
//     this.onFractionChange = this.onFractionChange.bind(this);
//   }

//   componentDidMount = () => {
//     const { spiritService } = this.props;
//     // const fractions = spiritService.getSpiritFractionsList();
//     const fractions = spiritService.get<string[]>('spiritFractionsList');
//     this.setState({
//       fractions: sort(fractions),
//     });
//     console.log('FractionList mounted');
//     this.props.spiritService.on('fractionChange', this.onFractionChange);
//   }

//   componentDidUpdate = (prevProps: FractionListProps) => {
//     console.log('FractionList did update');
//     if (prevProps.spiritService === this.props.spiritService) {
//       return;
//     }
//     this.onUpdate(prevProps);
//   }

//   onUpdate(prevProps: FractionListProps) {
//     prevProps.spiritService.off('fractionChange', this.onFractionChange);

//     const { spiritService } = this.props;
//     // const fractions = spiritService.getSpiritFractionsList();
//     const fractions = spiritService.get<string[]>('spiritFractionsList');
//     this.setState({
//       fractions: sort(fractions),
//     });
//     spiritService.on('fractionChange', this.onFractionChange);
//   }

//   componentWillUnmount = () => {
//     console.log('FractionList will unmount');
//     this.props.spiritService.off('fractionChange', this.onFractionChange);
//   }

//   onFractionChange({ fractions }:{ fractions: string[] }) {
//     this.setState({
//       fractions: sort(fractions),
//     });
//   }

//   render() {
//     const { fractions } = this.state;
//     return (
//       <datalist className="FractionList" id="fraction-datalist">
//         {
//           // eslint-disable-next-line jsx-a11y/control-has-associated-label
//           fractions.map((fraction) => <option key={fraction} value={fraction} />)
//         }
//       </datalist>
//     );
//   }
// }
