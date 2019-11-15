import React, { Component } from 'react';
import './Search.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

// import { SearchPropTypes } from '../../types';
import classNames from 'classnames';

export class Search extends Component {
  // static propTypes = SearchPropTypes;

  constructor() {
    super();
    this.state = {
      searchStr: '',
      isInputFocused: false,
      isClearFocused: false,
    };
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.onClearFocus = this.onClearFocus.bind(this);
    this.onClearBlur = this.onClearBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  // componentDidMount = () => {
  //   console.log('Search mounted');
  // }

  // componentDidUpdate = () => {
  //   console.log('Search did update');
  // }

  // componentWillUnmount = () => {
  //   console.log('Search will unmount');
  // }

  onInputFocus() {
    this.setState({
      isInputFocused: true,
    });
  }

  onInputBlur() {
    this.setState({
      isInputFocused: false,
    });
  }

  onClearFocus() {
    this.setState({
      isClearFocused: true,
    });
  }

  onClearBlur() {
    this.setState({
      isClearFocused: false,
    });
  }

  onChange(e) {
    this.setState({
      searchStr: e.target.value,
    });
    this.props.onSearchChange(e.target.value);
  }


  onClear() {
    this.setState({
      searchStr: '',
    });
    this.props.onSearchChange('');
  }

  render() {
    const { isInputFocused, isClearFocused, searchStr } = this.state;
    const { t, className } = this.props;

    const className2 = classNames('Search', className, {
      focused: isInputFocused || isClearFocused || searchStr.length > 0,
    });
    const clearClassName = classNames('clear-search',
      searchStr.length > 0 ? 'opacity-100' : 'opacity-0');
    return (

      <div data-search="" role="search" className={className2}>
        {/* <label id="search-input-label-1" className="bx--label" htmlFor="search__input-1">Search</label> */}
        <input
          className="search-input"
          type="text"
          placeholder="Search"
          value={searchStr}
          onChange={this.onChange}
          onFocus={this.onInputFocus}
          onBlur={this.onInputBlur}
        />
        <FontAwesomeIcon className="magnifier" icon={faSearch} />
        <button
          className={clearClassName}
          title="Clear search input"
          aria-label="Clear search input"
          type="button"
          onClick={this.onClear}
          onFocus={this.onClearFocus}
          onBlur={this.onClearBlur}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    );
  }
}
