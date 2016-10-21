var Application = require('spectron').Application
var assert = require('assert')

var app = new Application({
  path: '/Users/przemol/electron-quick-start/dist/mac/SeqPlots.app/Contents/MacOS/SeqPlots'
})

app.start().then(function () {
  // Check if the window is visible
  return app.browserWindow.isVisible()
}).then(function (isVisible) {
  // Verify the window is visible
  assert.equal(isVisible, true)
}).then(function () {
  // Get the window's title
  return app.client.getTitle()
}).then(function (title) {
  // Verify the window's title
  assert.equal(title, 'SeqPlots')
}).then(function () {
  // Get the window's title pt2
  return app.client.getTitle()
}).then(function () {
  // Stop the application
  return app.stop()
}).catch(function (error) {
  // Log any failures
  console.error('Test failed', error.message)
})
