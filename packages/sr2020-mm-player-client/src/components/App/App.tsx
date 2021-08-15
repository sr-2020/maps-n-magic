import React, { Component, useState, useEffect, PropsWithChildren } from 'react';

import './App.css';

import DocumentTitle from 'react-document-title';

import { ErrorBoundry } from "../ErrorBoundry";
import { HashRouter as Router, Route, Switch, Redirect, NavLink } from 'react-router-dom';

import { locationData2SoundStageState, LoginManager } from "../../utils";
import { LinkDef, LoginState } from "../../types";
import { WithLoginState, WithAggregatedLocationData } from '../../hocs';
import { LoginPage } from '../LoginPage';
import { SpiritList } from "../SpiritList";
import { QrTest } from "../QrTest";
import { SpiritPage } from "../SpiritPage";
import { SuitSpiritPage } from "../SuitSpiritPage";
import { AudioContextWrapper, SoundStorage } from 'sr2020-mm-client-event-engine';
// import { AppHeader } from '../AppHeader';
import { SoundStage } from '../SoundStage';
import { SoundSettings, SoundStageState } from 'sr2020-mm-event-engine';
import { CatchSpiritPage } from '../CatchSpiritPage';
import { CharacterPage } from '../CharacterPage';
import { DispiritPage } from '../DispiritPage';
import { EmergencyDispiritPage } from '../EmergencyDispiritPage';
import { LocationChangePage } from '../LocationChangePage';
import { HistoryPage } from '../HistoryPage';
import { AppHeader2 } from '../AppHeader2';
import { dictionary } from "../../utils";

interface AppProps extends WithLoginState, WithAggregatedLocationData {
  loginManager: LoginManager;
  audioContextWrapper: AudioContextWrapper;
  soundStorage: SoundStorage;
}

const SOUND_SETTINGS: SoundSettings = {
  rotationTimeout: 2000,
  rotationSoundTimeout: 5000,
  backgroundVolume: 50,
  rotationVolume: 50,
};

const baseLinks: LinkDef[] = [{
  to: '/character',
  label: dictionary.characterPageTitle
},{
  to: '/history',
  label: dictionary.historyPageTitle
}];

const badDispiritLinks: LinkDef[] = [{
  to: '/character',
  label: dictionary.characterPageTitle
},{
  to: '/history',
  label: dictionary.historyPageTitle
}];

const notInSpiritLinks: LinkDef[] = [{
  to: '/character',
  label: dictionary.characterPageTitle
},{
  to: '/spirits',
  label: dictionary.catchSpiritPageTitle
},{
  to: '/scanSpirit',
  label: dictionary.scanSpiritPageTitle
},{
  to: '/suitSpirit',
  label: dictionary.suitSpiritPageTitle
},{
  to: '/history',
  label: dictionary.historyPageTitle
}];

const inNormalSpiritLinks: LinkDef[] = [{
  to: '/character',
  label: dictionary.characterPageTitle
},{
  to: '/dispirit',
  label: dictionary.dispiritPageTitle
},{
  to: '/emergencyDispirit',
  label: dictionary.emergencyDispiritPageTitle
},{
  to: '/history',
  label: dictionary.historyPageTitle
}];


export function App(props: AppProps) {
  const { 
    loginState, 
    loginManager, 
    locationData,
    characterData,
    audioContextWrapper,
    soundStorage
  } = props;
  const manageTitle = useState<string>(dictionary.indexTitle);
  const [title, setTitle] = manageTitle;
  const [mute, setMute] = useState<boolean>(false);

  if (characterData === null) {
    return <div>{dictionary.characterDataLoading}</div>
  }

  const soundStageState = locationData2SoundStageState(characterData, locationData);

  if (characterData.workModel.healthState !== 'healthy') {
    return (
    <DocumentTitle title={title}>
      <Router>
        <div className="App">
          <AppHeader2
            title={title}
            loginManager={loginManager}
            locationData={locationData}
            characterData={characterData}
            mute={mute}
            setMute={setMute}
            links={baseLinks}
          />
          <CharacterPage 
            setTitle={setTitle}
            characterData={characterData}
          />
          </div>
        </Router>
      </DocumentTitle>
    );
  }

  const links = characterData.spiritSuitState === undefined ?
                  notInSpiritLinks : 
                  characterData.spiritSuitState.suitStatus === 'normal' ?
                    inNormalSpiritLinks :
                    badDispiritLinks;

  return (
    <DocumentTitle title={title}>
      <Router>
        <div className="App">
          <AppHeader2
            title={title}
            loginManager={loginManager}
            locationData={locationData}
            characterData={characterData}
            mute={mute}
            setMute={setMute}
            links={links}
          />

          <Switch>
            {
              characterData.spiritSuitState === undefined && 
              <Route path="/spirits">
                <SpiritList 
                  setTitle={setTitle}
                  locationData={locationData}
                  characterData={characterData}
                />
              </Route>
            }
            <Route path="/scanSpirit">
              <SpiritPage 
                setTitle={setTitle}
                characterData={characterData}
              />
            </Route>
            {
              characterData.spiritSuitState === undefined && 
              <Route path="/suitSpirit">
                <SuitSpiritPage 
                  setTitle={setTitle}
                  characterData={characterData}
                />
              </Route>
            }
            {
              characterData.spiritSuitState !== undefined && 
              <Route path="/dispirit">
                <DispiritPage 
                  setTitle={setTitle}
                  characterData={characterData}
                />
              </Route>
            }
            {
              characterData.spiritSuitState !== undefined && 
              <Route path="/emergencyDispirit">
                <EmergencyDispiritPage 
                  setTitle={setTitle}
                />
              </Route>
            }
            <Route path="/character">
              <CharacterPage 
                setTitle={setTitle}
                characterData={characterData}
              />
            </Route>
            <Route path="/locationChange">
              <LocationChangePage
                setTitle={setTitle}
                locationData={locationData}
              />
            </Route>
            <Route path="/history">
              <HistoryPage
                setTitle={setTitle}
              />
            </Route>
            <Route
              path="/catchSpirit/:id"
              render={({ match }) => {
                const { id } = match.params;

                return (
                  <CatchSpiritPage
                    id={Number(id)}
                    key={Number(id)}
                  />
                );
              }}
            />
            <Route path="/">
              <Redirect to="/character" />
            </Route>
          </Switch>

          <SoundStage 
            soundSettings={SOUND_SETTINGS}
            soundStageState={soundStageState} 
            audioContextWrapper={audioContextWrapper} 
            soundStorage={soundStorage}
            mute={mute}
          />
        </div>
      </Router>
    </DocumentTitle>
  );
}


