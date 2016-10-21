var Application = require('spectron').Application
var assert = require('assert')

describe('application launch', function () {
  this.timeout(100000)

  beforeEach(function () {
    this.app = new Application({
      path: '/Users/przemol/electron-quick-start/dist/mac/SeqPlots.app/Contents/MacOS/SeqPlots'
    })
    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 2)
    })
  })

  it('shows an initial window', function () {
    return this.app.client.getText('#api-status-up').then(function (errorText) {
      console.log('The #api-status-up text content is ' + errorText)
    })
  })



})
