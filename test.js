var Application = require('spectron').Application
var assert = require('assert')

var os = require('os');
var sys = os.platform(); // 'darwin'
console.log('Sysyem: ' + sys + ' ' + os.release());

var path = '';

if(sys=='darwin') {
  var path = './dist/mac/SeqPlots.app/Contents/MacOS/SeqPlots'
} else if(sys=='linux') {
  var path = './dist/linux-unpacked/SeqPlots'
}


describe('==>> Application launch', function () {
  this.timeout(100000)

  beforeEach(function () {
    this.app = new Application({
      path: path
    })
    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('Shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 2)
    })
  })

  it('Get some controls', function () {
    return this.app.client.getText('#api-status-up').then(function (errorText) {
      console.log('\tThe #api-status-up text content is ' + errorText)
    })
  })



})
