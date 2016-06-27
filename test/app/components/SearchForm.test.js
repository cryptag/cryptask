import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import SearchForm from '../../../app/components/SearchForm';

describe("SearchForm", function() {

  it("contains a search box", function() {
    expect(mount(<SearchForm />).find('.search-box').length).to.equal(1);
  });

  it("contains spec with an expectation", function() {
    expect(mount(<SearchForm />).find('.form').length).to.equal(1);
  });
});
