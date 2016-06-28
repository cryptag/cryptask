import React, { Component } from 'react';
import ResultList from './components/ResultList';
import SearchForm from './components/SearchForm';

const request = require('superagent');
const utf8 = require('utf8');

const cryptagdPrefix = require('superagent-prefix')('http://localhost:7878/trusted');

export default class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      searchValue: '',
      flashMessage: '',
      results: []
    };

    this.onChangeTagValue = this.onChangeTagValue.bind(this);
    this.executeSearch = this.executeSearch.bind(this);
  }

  onChangeTagValue(e){
    this.setState({
      searchValue: e.target.value
    });
  }

  tagByPrefix(plaintags, prefix) {
    for (let i = 0; i < plaintags.length; i++) {
      if (plaintags[i].startsWith(prefix)) {
        return plaintags[i];
      }
    }
    return '';
  }

  tagsByPrefixStripped(plaintags, prefix) {
    let stripped = [];
    for (let i = 0; i < plaintags.length; i++) {
      if (plaintags[i].startsWith(prefix)) {
        // Strip off prefix
        stripped.push(plaintags[i].slice(prefix.length));
      }
    }
    return stripped;
  }

  cleanedFields(s){
    let fields = s.trim().replace(',', ' ').split(/\s+/g);
    return fields.filter(f => f !== '');
  }

  executeSearch(e){
    e.preventDefault();

    let plaintags = this.cleanedFields(this.state.searchValue)

    // Only fetch Tasks (not text, files, nor anything else)
    plaintags.push('type:task');

    request
      .post('/rows/get')
      .use(cryptagdPrefix)
      .send(plaintags)
      .end( (err, res) => {
        let results = [];
        let flashMessage = '';

        if (err) {
          if (typeof res === 'undefined') {
            flashMessage = err.toString();
          } else {
            flashMessage = res.body.error;
          }
        } else {
          results = res.body.map((result) => {
            let task = JSON.parse(utf8.decode(atob(result.unencrypted)));
            return {
              key: this.tagByPrefix(result.plaintags, "id:"),
              title: task.Title,
              description: task.Description,
              assignees: this.tagsByPrefixStripped(result.plaintags, "assignee:"),
              tags: result.plaintags
            };
          });
        }

        this.setState({
          results: results,
          flashMessage: flashMessage
        });
      });
  }

  render(){
    return (
      <div>
        <div className="row">
          <SearchForm
            executeSearch={this.executeSearch}
            onChangeTagValue={this.onChangeTagValue}
            flashMessage={this.state.flashMessage} />
        </div>

        <ResultList results={this.state.results} />
      </div>
    );
  }
}
