var scriptProperties = PropertiesService.getScriptProperties();

var Sheet_Id = scriptProperties.getProperty("SHEET_ID");
const SHEET = SpreadsheetApp.openById(Sheet_Id)

function doPost(e) {
  var name = e.parameter["Expense"]
  var amount = e.parameter["Amount"]
  var category = e.parameter["Category"]
  row = [toTitleCase(name), category, amount]
  const sheet = getSheetByDate() // or your tab name
  var lastRow = getLastRow(sheet, 'A1:A') + 1
  console.log(lastRow)
  sheet.getRange(lastRow, 1, 1, row.length).setValues([row]);
}

function doGet(e){
  const sheet = getSheetByDate()

  const colsToTake = 2
  const rowsToTake = getLastRow(sheet, "F1:F")
  const colToStart = 5
  const rowToStart = 1

  const data = sheet.getRange(rowToStart, colToStart, rowsToTake, colsToTake).getValues();
  return ContentService.createTextOutput(JSON.stringify({ data: data })).setMimeType(ContentService.MimeType.JSON);
}

function getSheetByDate(){
  var date = new Date(Date.now())
  date = Utilities.formatDate(date,"SGT", "MMMM yyyy")
  return SHEET.getSheetByName(date);
}

function toTitleCase(name){
  // converts input for expense name to title case regex is word bounded and will replace all lowercase with uppercase letters
  return name.replace(/\b[a-z]/ig, function(match) {return match.toUpperCase()})
}

function getLastRow(sheet, col){
  var lastRow = sheet.getLastRow();
  var values = sheet.getRange(col + lastRow).getValues();
  return values.flat(Infinity).filter(item=>item!=='').length + 1
}

function updateSheetNamesRow() {
  var sheet = SHEET.getSheetByName("Total"); // current sheet
  var templateSheet = SHEET.getSheetByName("Template")

  var sheets = SHEET.getSheets();

  var cur = 1; // cursor to allow the program to know which row is it at 
  var row = 1; // row to start from
  var rows = getLastRow(templateSheet, "F1:F") // number of rows to occupy (6 categories + Overall)
  for (var i = 2; i < sheets.length; i++) {
      var name = sheets[i].getName();
      val = sheets[i].getRange(`E1:F${rows}`).getValues();
      // write total expenses from other sheets into first page
      sheet.getRange(row, cur, rows, val[0].length).clearContent().clearFormat()
        .setValues(val)
        .setBackground("#D7FCD4") //background color: grey
        .setBorder(true,true,true,true,true,true); //borders

      sheet.getRange(rows, 1, 1, 1).setValue("Overall")
      sheet.getRange(rows, 1, 1, 2).setBackground("#72F3FF").setFontWeight("Bold")//overall

      //set number format to be $0.00
      sheet.getRange(row+1, cur+1, rows, val[0].length).setNumberFormat("$#,##0.00")
      
      sheet.getRange(row, cur, 1, 2).clearContent().clearFormat()
        .mergeAcross() //merge cell
        .setHorizontalAlignment("center") //align center
        .setValue(name) //sets name of sheet
        .setFontWeight("Bold") //Font: bold
        .setBackground("#545454") //Background Color: black
        .setFontColor("White"); //Font Color: White

      cur += 3 // increment column by 3 (to have spacing between each month)

      if (cur > 18){
        cur = 1
        col += rows + 1
      }
    };
}

function createNewSheet(){
  var date = new Date(Date.now())
  date = Utilities.formatDate(date,"SGT", "MMMM yyyy")
  if (!SHEET.getSheetByName(date)){//checks if sheet already exists
    var sheet = SHEET.getSheetByName('Template');
    sheet.copyTo(SHEET).setName(date);// create a sheet from template sheet
  }
  return
}