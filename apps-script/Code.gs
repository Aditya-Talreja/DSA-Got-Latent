// ═══════════════════════════════════════════════════════════
// DSA Got Latent — Apps Script: Seat Availability API
// ═══════════════════════════════════════════════════════════
//
// SETUP INSTRUCTIONS:
// 1. Open your Google Sheet (the one linked to your Form)
// 2. Go to Extensions → Apps Script
// 3. Delete any existing code and paste this entire file
// 4. Click Save (Ctrl+S)
//
// DEPLOY AS WEB APP:
// 5. Click Deploy → New deployment
// 6. Type: "Web app"
// 7. Execute as: "Me"
// 8. Who has access: "Anyone"
// 9. Click Deploy → Copy the URL
// 10. Paste that URL into your website's js/app.js file
//     (replace 'YOUR_APPS_SCRIPT_URL_HERE')
//
// SET UP AUTO-REMOVE TRIGGER:
// 11. In Apps Script, click the clock icon (Triggers) in the left sidebar
// 12. Click "+ Add Trigger"
// 13. Function: onFormSubmit
// 14. Event source: From spreadsheet
// 15. Event type: On form submit
// 16. Click Save
//
// ═══════════════════════════════════════════════════════════


// ── 1. JSON API ENDPOINT ──────────────────────────────────
// Your website calls this URL every 5 seconds to get seat data.

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dashboard");
  var data = sheet.getDataRange().getValues();
  var result = [];

  // Skip header row (row 0)
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === "") continue; // skip empty rows
    result.push({
      topic: data[i][0],      // Column A: Topic name
      capacity: data[i][1],   // Column B: Capacity (10)
      registered: data[i][2], // Column C: Registered count (COUNTIF formula)
      available: data[i][3]   // Column D: Available = Capacity - Registered
    });
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", topics: result }))
    .setMimeType(ContentService.MimeType.JSON);
}


// ── 2. AUTO-SYNC FORM DROPDOWN WITH SEAT AVAILABILITY ─────
// This runs automatically every time a form is submitted.
// - REMOVES topics from dropdown when Available <= 0
// - ADDS BACK topics to dropdown when Available > 0 (e.g. capacity increased)

function onFormSubmit(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dashboard = ss.getSheetByName("Dashboard");
  var data = dashboard.getDataRange().getValues();

  // Separate topics into full vs available
  var fullTopics = [];
  var availableTopics = [];

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === "") continue;
    var topicName = data[i][0].toString().trim();
    var available = Number(data[i][3]); // Column D: Available

    console.log("Topic: " + topicName + " | Available: " + available);

    if (available <= 0) {
      fullTopics.push(topicName);
    } else {
      availableTopics.push(topicName);
    }
  }

  console.log("Full topics: " + JSON.stringify(fullTopics));
  console.log("Available topics: " + JSON.stringify(availableTopics));

  // ⚠️ PASTE YOUR GOOGLE FORM EDIT URL BELOW
  // Open your Google Form → copy the URL from the address bar
  // It should look like: https://docs.google.com/forms/d/XXXXX/edit
  var formUrl = "YOUR_GOOGLE_FORM_EDIT_URL_HERE";

  var form = FormApp.openByUrl(formUrl);
  var items = form.getItems();

  for (var j = 0; j < items.length; j++) {
    var item = items[j];
    var type = item.getType();
    var title = item.getTitle().toLowerCase();

    // Only modify the topic selection question — skip everything else
    if (title.indexOf("topic") === -1) continue;

    console.log("Found topic question: '" + item.getTitle() + "' | Type: " + type);

    if (type === FormApp.ItemType.LIST) {
      var listItem = item.asListItem();
      var currentChoices = listItem.getChoices();

      // Get current choice values
      var currentValues = [];
      for (var k = 0; k < currentChoices.length; k++) {
        currentValues.push(currentChoices[k].getValue().trim());
      }

      // Build new choices list:
      // 1. Keep existing choices that are NOT full
      var newChoices = [];
      for (var k = 0; k < currentValues.length; k++) {
        if (fullTopics.indexOf(currentValues[k]) === -1) {
          newChoices.push(listItem.createChoice(currentValues[k]));
        } else {
          console.log("REMOVING: " + currentValues[k]);
        }
      }

      // 2. Add back available topics that are missing from dropdown
      for (var a = 0; a < availableTopics.length; a++) {
        if (currentValues.indexOf(availableTopics[a]) === -1) {
          newChoices.push(listItem.createChoice(availableTopics[a]));
          console.log("RESTORING: " + availableTopics[a]);
        }
      }

      // Update if anything changed and at least 1 choice remains
      if (newChoices.length > 0) {
        listItem.setChoices(newChoices);
        console.log("Dropdown updated! Now has " + newChoices.length + " choices.");
      }
    }

    if (type === FormApp.ItemType.MULTIPLE_CHOICE) {
      var mcItem = item.asMultipleChoiceItem();
      var mcChoices = mcItem.getChoices();

      var mcValues = [];
      for (var m = 0; m < mcChoices.length; m++) {
        mcValues.push(mcChoices[m].getValue().trim());
      }

      var newMcChoices = [];
      for (var m = 0; m < mcValues.length; m++) {
        if (fullTopics.indexOf(mcValues[m]) === -1) {
          newMcChoices.push(mcItem.createChoice(mcValues[m]));
        } else {
          console.log("REMOVING: " + mcValues[m]);
        }
      }

      for (var a = 0; a < availableTopics.length; a++) {
        if (mcValues.indexOf(availableTopics[a]) === -1) {
          newMcChoices.push(mcItem.createChoice(availableTopics[a]));
          console.log("RESTORING: " + availableTopics[a]);
        }
      }

      if (newMcChoices.length > 0) {
        mcItem.setChoices(newMcChoices);
        console.log("Multiple choice updated! Now has " + newMcChoices.length + " choices.");
      }
    }
  }
}


// ── 3. MANUAL TEST FUNCTION ───────────────────────────────
// Run this manually to test the sync logic.

function testSyncFormTopics() {
  onFormSubmit(null);
  console.log("Test complete - check your Google Form!");
}
