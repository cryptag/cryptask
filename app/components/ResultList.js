import React, { Component } from 'react';

import Result from './Result';

export default class ResultList extends Component {
  render(){
    let results = this.props.results;

    return (
      <table role="table" className="table table-striped">
        <thead>
          <tr>
            <th className="col-sm-3">Title</th>
            <th className="col-sm-6">Descriptions</th>
            <th className="col-sm-1">Assignees</th>
            <th className="col-sm-2">Tags</th>
          </tr>
        </thead>
        <tbody>
          {results.map( (result) => {
            return <Result key={result.key} result={result} />;
          } )}
        </tbody>
      </table>
    );
  }
}
