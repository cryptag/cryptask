import React, { Component } from 'react';

import Result from './Result';

export default class ResultList extends Component {
  render(){
    let results = this.props.results;

    return (
      <table role="table" className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Descriptions</th>
            <th>Assignees</th>
            <th>Tags</th>
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
