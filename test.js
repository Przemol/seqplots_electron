var Application = require('spectron').Application
var assert = require('assert')

var os = require('os');
var sys = os.platform(); // 'darwin'
console.log('Sysyem: ' + sys + ' ' + os.release());

const fs = require('fs');

var path = '';

if(sys=='darwin') {
  var path = './dist/mac/SeqPlots.app/Contents/MacOS/SeqPlots'
} else if(sys=='linux') {
  var path = './dist/linux-unpacked/SeqPlots'
} else {
  var path = './dist/win-ia32-unpacked/SeqPlots.exe'
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
    var app = this.app;
    var res = this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 2)
    }).then(function() {
      console.log('\ttaking s-shot')
      app.browserWindow.capturePage().then(function (imageBuffer) {
        fs.writeFile('page0.png', imageBuffer)
      })
    });
    return res;
  })
  
  //
  
  it('SeqPlots tests', function () {
    var app = this.app;
    var res = this.app.client
    .waitUntilWindowLoaded().then(function () {
      console.log('  ==>> Testing SeqPlots')
    })
    .getWindowCount()
    .then(function (count) {
      assert.equal(count, 2)
    })
    .getText('#api-status-waiting')
    .then(function (errorText) {
      console.log('\tStatus: ' + errorText)
    })
    .waitUntilTextExists('#api-status-up', 'SeqPlots running', 120000)
    .then(function () {
      console.log('\tSeqPlots is running')
    })
    .windowByIndex(1)
    .waitUntilTextExists('button[onclick="tutorial.next()"]', 'Start tutorial', 120000)
    .then(function () {console.log('\tTutorial ON')}).
    click('button[onclick="tutorial.next()"]')
    .then(function () {console.log('\tTutorial started')})
    .pause(2000).
    click('[data-target="#calcModal"]')
    .pause(3000)
    .click('tr*=H3K4me3_celegans_N2_L3_chrI.bw')
    .pause(1000)
    .click('[data-value="Features"]')
    .pause(1000)
    .click('tr*=Genes_celegans_bottom_20pct_expression_chr1.bed')
    .pause(1000)
    .click('tr*=Genes_celegans_top_20pct_expression_chr1.bed')
    .pause(1000)
    .click('[data-value="Sequence features"]')
    .pause(1000)
    .click('#SFpattern')
    .keys('GC')
    .pause(3000)
    .click('#SFname')
    .keys('CpG')
    .pause(3000)
    .click('#SFadd')
    .pause(1000)
    .click('#plot_type')
    .pause(1000)
    .click('#runcalc')
    .pause(10000)
    .click('input[value="[1,1]"]').pause(600)
    .click('input[value="[1,2]"]').pause(600)
    .click('#replotL').pause(3000)
    .then(function () {console.log('\t1st plot done')})
    .click('thead th:nth-child(2) button').pause(3000)
    .click('thead th:nth-child(3) button').pause(1000)
    .click('#replotL').pause(3000)
    .then(function () {console.log('\t2nd plot done')})
    .click('thead th:nth-child(1) button:nth-child(3)').pause(3000)
    .click('tbody tr:nth-child(2) a').pause(1000)
    .click('#replotH').pause(6000)
    .then(function () {console.log('\tHmap plot done')})
    .click('#preview-pdf-div').pause(2000)
    .click('#zoomcanvas').pause(2000)
    .then(function () {console.log('\tCanvas zoom in and out')})
    .keys('\uE00C').pause(2000)
    .then(function () {console.log('\tTutorial out')}).pause(500)
    //.click('*=PDF').pause(1000)
    .then(function() {
      console.log('\ttaking s-shot')
      app.browserWindow.capturePage().then(function (imageBuffer) {
        fs.writeFile('page.png', imageBuffer)
      })
    })
    .pause(1000);
    return res;
  })



})
