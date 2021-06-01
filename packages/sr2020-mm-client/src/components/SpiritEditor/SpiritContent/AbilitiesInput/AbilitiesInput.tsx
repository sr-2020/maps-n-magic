export {};
// import React, { Component, FormEvent, MouseEvent } from 'react';
// import './AbilitiesInput.css';

// import Button from 'react-bootstrap/Button';
// import ButtonGroup from 'react-bootstrap/ButtonGroup';
// import InputGroup from 'react-bootstrap/InputGroup';
// import FormControl from 'react-bootstrap/FormControl';
// import Form from 'react-bootstrap/Form';
// import classNames from 'classnames';
// import { GameModel, Spirit } from "sr2020-mm-event-engine";
// import { WithTranslation } from "react-i18next";

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTimes } from '@fortawesome/free-solid-svg-icons';
// import * as R from 'ramda';

// // import { AbilitiesInputPropTypes } from '../../../../types';

// const sort = R.sortBy(R.toLower);

// interface AbilitiesInputProps extends WithTranslation {
//   gameModel: GameModel;
//   id: number;
//   className?: string;
// }

// interface AbilitiesInputState {
//   initialized: boolean;
//   abilities: string[];
//   allAbilities: string[];
// }

// export class AbilitiesInput extends Component<AbilitiesInputProps, AbilitiesInputState> {
//   // static propTypes = AbilitiesInputPropTypes;

//   constructor(props: AbilitiesInputProps) {
//     super(props);
//     this.state = {
//       initialized: false,
//       abilities: [],
//       allAbilities: []
//     };
//     this.onSubmit = this.onSubmit.bind(this);
//   }

//   componentDidMount() {
//     const { id, gameModel } = this.props;
//     this.setState({
//       // abilities: sort(gameModel.getSpirit(id).abilities),
//       abilities: sort(gameModel.get<Spirit>({
//         type: 'spirit',
//         id,
//       }).abilities),
//       // allAbilities: gameModel.getSpiritAbilitiesList(),
//       allAbilities: gameModel.get('spiritAbilitiesList'),
//       initialized: true,
//     });
//   }

//   componentDidUpdate(prevProps: AbilitiesInputProps) {
//     if (prevProps.id === this.props.id) {
//       return;
//     }
//     const {
//       id, gameModel,
//     } = this.props;
//     // eslint-disable-next-line react/no-did-update-set-state
//     this.setState({
//       // abilities: gameModel.getSpirit(id).abilities,
//       abilities: gameModel.get<Spirit>({
//         type: 'spirit',
//         id,
//       }).abilities,
//       // allAbilities: gameModel.getSpiritAbilitiesList(),
//       allAbilities: gameModel.get('spiritAbilitiesList'),
//     });
//     // console.log('AbilitiesInput did update');
//   }

//   onSubmit(e: FormEvent<HTMLFormElement>) {
//     const form = e.currentTarget;
//     e.stopPropagation();
//     e.preventDefault();
//     // console.log('onsubmit');
//     const { abilities } = this.state;
//     const { id, gameModel } = this.props;
//     if (form.checkValidity() === true) {
//       const ability = form.newAbility.value.trim();
//       if (!abilities.includes(ability)) {
//         // gameModel.putSpirit(id, {
//         //   abilities: [...abilities, ability],
//         // });
//         gameModel.execute({
//           type: 'putSpirit',
//           id,
//           props: {
//             abilities: [...abilities, ability],
//           },
//         });
//         this.setState(({ abilities: prevAbilities }) => ({
//           abilities: sort([...prevAbilities, ability]),
//           // allAbilities: gameModel.getSpiritAbilitiesList(),
//           allAbilities: gameModel.get('spiritAbilitiesList'),
//         }));
//         form.newAbility.value = '';
//       }
//       // this.createNewSpirit(form.spiritName.value);
//     }
//   }

//   removeAbility(e: MouseEvent, ability: string) {
//     const { id, gameModel } = this.props;
//     const { abilities } = this.state;
//     const newAbilities = abilities.filter((ab) => ab !== ability);
//     // gameModel.putSpirit(id, {
//     //   abilities: newAbilities,
//     // });
//     gameModel.execute({
//       type: 'putSpirit',
//       id,
//       props: {
//         abilities: newAbilities,
//       },
//     });
//     this.setState(({ abilities: prevAbilities }) => ({
//       abilities: prevAbilities.filter((ab) => ab !== ability),
//       allAbilities: gameModel.get('spiritAbilitiesList'),
//     }));
//   }

//   render() {
//     const { abilities, allAbilities, initialized } = this.state;
//     if (!initialized) {
//       return null;
//     }

//     const { t, className } = this.props;

//     const datalistAbilities = sort(R.difference(allAbilities, abilities));

//     const className2 = classNames('AbilitiesInput', className);
//     return (
//       <div className={className2}>
//         <Form onSubmit={this.onSubmit}>
//           <InputGroup className="tw-mb-3">
//             <FormControl required id="newAbility" list="abilities-datalist" />
//             <InputGroup.Append>
//               <Button type="submit" variant="outline-secondary">{t('addAbility')}</Button>
//             </InputGroup.Append>
//           </InputGroup>
//         </Form>
//         <div>
//           {abilities.map((ability) => (
//             <ButtonGroup key={ability} className="tw-mr-2 tw-mb-2">
//               <Button variant="secondary">{ability}</Button>
//               <Button variant="secondary" onClick={(e: MouseEvent) => this.removeAbility(e, ability)}><FontAwesomeIcon icon={faTimes} /></Button>
//             </ButtonGroup>
//           ))}


//         </div>
//         <datalist id="abilities-datalist">
//           {
//           // eslint-disable-next-line jsx-a11y/control-has-associated-label
//             datalistAbilities.map((ability) => <option key={ability} value={ability} />)
//           }
//         </datalist>
//       </div>
//     );
//   }
// }
