/**
 * Waitlist — matches the site: POST body is JSON { name, email } (sent as text/plain from the browser).
 *
 * IMPORTANT — SpreadsheetApp.getActiveSpreadsheet() only works if this project is BOUND to a sheet:
 * open the Google Sheet → Extensions → Apps Script → paste this → Deploy web app.
 * If you created the script at script.google.com with NO spreadsheet, getActiveSpreadsheet()
 * is null in doPost — use openById instead (see getSheet_ below).
 */

// Only needed for standalone scripts (not bound to a sheet). Leave '' if you use a bound script.
var SPREADSHEET_ID = ''

function getSheet_() {
  if (SPREADSHEET_ID) {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID)
    return ss.getSheetByName('Sheet1') || ss.getSheets()[0]
  }
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  if (!ss) {
    throw new Error('No spreadsheet: bind this script to a Sheet (Extensions → Apps Script) or set SPREADSHEET_ID')
  }
  return ss.getActiveSheet()
}

function doPost(e) {
  var sheet = getSheet_()
  var raw = e.postData && e.postData.contents
  if (!raw) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: 'no body' }))
      .setMimeType(ContentService.MimeType.JSON)
  }
  var data = JSON.parse(raw)
  sheet.appendRow([data.name || '', data.email || '', new Date()])
  return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON)
}

/** Quick check in the browser: .../exec?name=&email=test%40example.com */
function doGet(e) {
  var sheet = getSheet_()
  var email = (e.parameter.email || '').trim()
  var name = (e.parameter.name || '').trim()
  if (!email) {
    return ContentService.createTextOutput('Add ?email=you@example.com')
  }
  sheet.appendRow([name, email, new Date()])
  return ContentService.createTextOutput('ok')
}
