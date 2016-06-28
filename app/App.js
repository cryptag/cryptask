import React, { Component } from 'react';
import ResultList from './components/ResultList';
import SearchForm from './components/SearchForm';
import SaveTaskForm from './components/SaveTaskForm';

const request = require('superagent');
const utf8 = require('utf8');

const cryptagdPrefix = require('superagent-prefix')('http://localhost:7878/trusted');

export default class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      // Search
      searchValue: '',
      flashMessage: '',
      results: [],

      // Save task
      title: '',
      description: '',
      assignees: '',
      tags: '',
      saveTaskFormMessage: ''
    };

    this.onChangeTagValue = this.onChangeTagValue.bind(this);
    this.executeSearch = this.executeSearch.bind(this);

    this.onChangeSaveTitle = this.onChangeSaveTitle.bind(this);
    this.onChangeSaveDescription = this.onChangeSaveDescription.bind(this);
    this.onChangeSaveAssignees = this.onChangeSaveAssignees.bind(this);
    this.onChangeSaveTags = this.onChangeSaveTags.bind(this);
    this.saveTask = this.saveTask.bind(this);
  }

  mergeState(obj){
    this.setState(
      Object.assign(this.state, obj)
    )
  }

  onChangeTagValue(e){
    this.mergeState({
      searchValue: e.target.value
    });
  }

  onChangeSaveTitle(e){
    this.mergeState({
      title: e.target.value
    });
  }

  onChangeSaveDescription(e){
    this.mergeState({
      description: e.target.value
    });
  }

  onChangeSaveAssignees(e){
    this.mergeState({
      assignees: e.target.value
    });
  }

  onChangeSaveTags(e){
    this.mergeState({
      tags: e.target.value
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

  saveTask(e){
    e.preventDefault();

    let title = this.state.title.trim();
    if (!title) {
      this.mergeState({saveTaskFormMessage: 'Error: title cannot be empty'});
      return
    }

    // TODO: Clarify to user that tags should be
    // space-separated. Later, make them comma-separated and split on
    // /,\s+/
    let plaintags = this.cleanedFields(this.state.tags);

    let assignees = this.cleanedFields(this.state.assignees);
    plaintags = plaintags.concat(
      assignees.map(a => 'assignee:'+a)
    );

    // Add tags users should't have to worry about
    plaintags = plaintags.concat(['type:task', 'app:cryptask']);

    let task = {
      Title: title,
      Description: this.state.description
    }

    let row = {
      unencrypted: btoa(utf8.encode(JSON.stringify(task))),
      plaintags: plaintags
    }

    request
      .post('/rows')
      .use(cryptagdPrefix)
      .send(row)
      .end( (err, res) => {
        let saveTaskFormMessage = '';

        if (err) {
          if (typeof res === 'undefined') {
            saveTaskFormMessage = err.toString();
          } else {
            saveTaskFormMessage = res.body.error;
          }

          this.mergeState({saveTaskFormMessage: saveTaskFormMessage});

          return
        }

        // Success

        let tags = res.body.plaintags;
        saveTaskFormMessage = 'New task saved with these tags: ' + tags.join(', ')

        this.mergeState({saveTaskFormMessage: saveTaskFormMessage});
      });
  }

  render(){
    return (
      <div>
        <div className="row">
          <SaveTaskForm
            saveTask={this.saveTask}
            onChangeSaveTitle={this.onChangeSaveTitle}
            onChangeSaveDescription={this.onChangeSaveDescription}
            onChangeSaveAssignees={this.onChangeSaveAssignees}
            onChangeSaveTags={this.onChangeSaveTags}
            saveTaskFormMessage={this.state.saveTaskFormMessage} />

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
