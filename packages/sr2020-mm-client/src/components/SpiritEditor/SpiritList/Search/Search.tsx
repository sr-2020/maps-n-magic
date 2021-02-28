import React, { Component } from 'react';
import './Search.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

import classNames from 'classnames';
// import { SearchPropTypes } from '../../../../types';

interface SearchProps {
  t: any;
  className: any;
  placeholder: any;
  onSearchChange: (value: string) => void
}
interface SearchState {
  isInputFocused: boolean;
  isClearFocused: boolean;
  searchStr: string;
}
// const { isInputFocused, isClearFocused, searchStr } = this.state;
// const { t, className, placeholder = 'Search' } = this.props;

export class Search extends Component<SearchProps, SearchState> {
  // static propTypes = SearchPropTypes;

  constructor(props) {
    super(props);
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
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onSearchChange(e.target.value);
  }


  onClear() {
    this.setState({
      searchStr: '',
    });
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onSearchChange('');
  }

  render() {
    const { isInputFocused, isClearFocused, searchStr } = this.state;
    const { t, className, placeholder = 'Search' } = this.props;

    const className2 = classNames('Search', className, {
      focused: isInputFocused || isClearFocused || searchStr.length > 0,
    });
    const clearClassName = classNames('clear-search',
      searchStr.length > 0 ? 'tw-opacity-100' : 'tw-opacity-0');
    return (

      <div data-search="" role="search" className={className2}>
        <input
          className="search-input"
          type="text"
          placeholder={placeholder}
          value={searchStr}
          onChange={this.onChange}
          onFocus={this.onInputFocus}
          onBlur={this.onInputBlur}
        />
        <FontAwesomeIcon className="magnifier" icon={faSearch} />
        <button
          className={clearClassName}
          title={t('clearSearchInput')}
          aria-label={t('clearSearchInput')}
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
