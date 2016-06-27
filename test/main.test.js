var Application = require('spectron').Application;
var assert = require('assert');
import { expect } from 'chai';

var filename = 'CrypTask-darwin-x64/CrypTask.app/Contents/MacOS/CrypTask'
if (process.platform === 'linux'){
  filename = 'CrypTask-linux-x64/CrypTask';
}

describe('application launch', function () {
  this.timeout(10000);

  beforeEach(function () {
    this.app = new Application({
      path: __dirname + '/../' + filename
    });
    return this.app.start();
  });

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      expect(count).to.equal(1);
    })
    .then(() => {
      return this.app.client.getTitle();
    })
    .then((title) => {
      expect(title).to.equal('CrypTask');
    });

  });

});
