var Application = require('spectron').Application
var assert = require('assert')

var os = require('os');
var sys = os.platform(); // 'darwin'
console.log('Sysyem: ' + sys + ' ' + os.release());

const fs = require('fs');

var short= true;
var path = '';

if(sys=='darwin') {
  var path = './dist/mac/SeqPlots.app/Contents/MacOS/SeqPlots'
} else if(sys=='linux') {
  var path = './dist/linux-unpacked/SeqPlots'
} else if(sys=='win32') {
  var path = './dist/win-ia32-unpacked/SeqPlots.exe'
}


describe('==>> Application launch', function () {
  this.timeout(1000000)

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
      console.log('\t - taking s-shot')
      app.browserWindow.capturePage().then(function (imageBuffer) {
        fs.writeFile('page0.png', imageBuffer)
      })
    });
    return res;
  })
  
  //
  
  it('SeqPlots tests', function () {
    if(sys=='linux') return 0;
    var app = this.app;
    var delay = 1000;
    
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
    .waitUntilTextExists('.popover-title', 'Bring up plot setup window', 120000).pause(delay)
    .click('[data-target="#calcModal"]')
    .then(function () {console.log('\tCalc modal up')})
    .waitUntilTextExists('.popover-title', 'Select track', 120000).pause(delay)
    .then(function() {
      console.log('\t - taking s-shot')
      app.browserWindow.capturePage().then(function (imageBuffer) {
        fs.writeFile('page_modal.png', imageBuffer)
      })
    })
    
    if(short) return res;
    
    res = res
    .click('td*=H3K4me3_celegans_N2_L3_chrI.bw')
    .then(function () {console.log('\tTrack selected')})
    .pause(5000)
    .then(function() {
      console.log('\t - taking s-shot')
      app.browserWindow.capturePage().then(function (imageBuffer) {
        fs.writeFile('page_modal2.png', imageBuffer)
      })
    });
    
    if(short) return res;
    
    res = res
    .waitUntilTextExists('.popover-title', 'Select genomic features', 120000).pause(delay)
    .then(function () {console.log('\tClicking feture tab')})
    .click('a*=Features')
    .then(function () {console.log('\tFeatures tab')})
    .waitUntilTextExists('.popover-title', 'Select 1st set of genomic intervals for plotting', 120000).pause(delay)
    .click('td*=Genes_celegans_bottom_20pct_expression_chr1.bed')
    .then(function () {console.log('\tFeature 1 selected')})
    .waitUntilTextExists('.popover-title', 'Select 2nd set of genomic intervals for plotting', 120000).pause(delay)
    .click('td*=Genes_celegans_top_20pct_expression_chr1.bed')
    .then(function () {console.log('\tFeature 2 selected')})
    .waitUntilTextExists('.popover-title', 'Select motifs', 120000).pause(delay)
    .click('a*=Sequence features')
    .waitUntilTextExists('.popover-title', 'Select motifs - pattern', 120000).pause(delay)
    .click('#SFpattern')
    .keys('GC')
    .waitUntilTextExists('.popover-title', 'Select motifs - name', 120000).pause(delay)
    .click('#SFname')
    .keys('CpG')
    .waitUntilTextExists('.popover-title', 'Add motif', 120000).pause(delay)
    .click('#SFadd')
    .then(function () {console.log('\tSequence selected')})
    .waitUntilTextExists('.popover-title', "Select plot type", 120000).pause(delay)
    .pause(2000).click('#plot_type')
    .then(function () {console.log('\tPlot type selected')})
    .waitUntilTextExists('.popover-title', "Start calculation", 120000).pause(delay)
    .pause(1000).click('#runcalc')
    .then(function () {console.log('\tRun calc')})
    .waitUntilTextExists('.popover-title', "Select what to plot", 120000).pause(delay)
    .click('input[value="[1,1]"]').pause(delay)
    .waitUntilTextExists('.popover-title', "Select what to plot", 120000).pause(delay)
    .click('input[value="[1,2]"]')
    .waitUntilTextExists('.popover-title', "Plot average signal profile", 120000).pause(delay)
    .click('#replotL')
    .waitUntilTextExists('.popover-title', "Toggle column selection", 120000).pause(delay)
    .then(function () {console.log('\t1st plot done')})
    .click('thead th:nth-child(2) button').pause(200)
    .waitUntilTextExists('.popover-title', "Toggle column selection", 120000).pause(delay)
    .click('thead th:nth-child(3) button')
    .waitUntilTextExists('.popover-title', "Re-plot average signal profile", 120000).pause(delay)
    .click('#replotL')
    .waitUntilTextExists('.popover-title', "Select none", 120000).pause(delay)
    .then(function () {console.log('\t2nd plot done')})
    .click('thead th:nth-child(1) button:nth-child(3)')
    .waitUntilTextExists('.popover-title', "Toggle row selection", 120000).pause(delay)
    .click('tbody tr:nth-child(2) a')
    .waitUntilTextExists('.popover-title', "Plot heatmap", 120000).pause(delay)
    .click('#replotH')
    .waitUntilTextExists('.popover-title', "The plot preview", 120000).pause(delay)
    .then(function () {console.log('\tHmap plot done')})
    .click('#preview-pdf-div').pause(100)
    .waitUntilTextExists('.popover-title', "The plot preview", 120000).pause(delay)
    .click('#zoomcanvas')
    .then(function () {console.log('\tCanvas zoom in and out')})
    .keys('\uE00C').pause(2000)
    .then(function () {console.log('\tTutorial out')}).pause(delay)
    //.click('*=PDF').pause(1000)
    .then(function() {
      console.log('\t - taking s-shot')
      app.browserWindow.capturePage().then(function (imageBuffer) {
        fs.writeFile('page.png', imageBuffer)
      })
    })
    .pause(1000);
    
    return res;
  })



})
