var scriptProperties = PropertiesService.getScriptProperties();

var Sheet_Id = scriptProperties.getProperty("SHEET_ID");
function doPost(e) {
  var name = e.parameter["Expense"]
  var amount = e.parameter["Amount"]
  var category = e.parameter["Category"]
  row = [toTitleCase(name), category, amount]
  var date = new Date(Date.now())
  date = Utilities.formatDate(date,"SGT", "MMMM yyyy")
  const sheet = SpreadsheetApp.openById(Sheet_Id).getSheetByName(date); // or your tab name
  var lastrow = GetLastRow(sheet)
  sheet.getRange(lastrow + 1, 1, 1, row.length).setValues([row]);
}

function GetLastRow(sheet){
  //prevent overlap caused by overall table on the right side of sheet
  if (sheet.getRange('A' + sheet.getLastRow()).getValue() == "") {
    return sheet.getRange('A' + sheet.getLastRow()).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  }
  return sheet.getLastRow();
}

function toTitleCase(name){
  // converts input for expense name to title case regex is word bounded and will replace all lowercase with uppercase letters
  return name.toLowerCase().replace(/\b[a-z]/ig, function(match) {return match.toUpperCase()})
}

function updateSheetNamesRow() {
  var sheet = SpreadsheetApp.openById(Sheet_Id).getSheetByName("Total"); // current sheet

  var sheets = SpreadsheetApp.openById(Sheet_Id).getSheets();

  var cur = 1; // cursor to allow the program to know which row is it at 
  var row = 1; // row to start from
  var rows = 7 // number of rows to occupy (6 categories + Overall)

  for (var i = 2; i < sheets.length; i++) {
      var name = sheets[i].getName();
      val = sheets[i].getRange('E1:F7').getValues();
      // write total expenses from other sheets into first page
      sheet.getRange(row+1, cur, rows, val[0].length).clearContent().clearFormat()
        .setValues(val)
        .setBackground("#D7FCD4") //background color: grey
        .setBorder(true,true,true,true,true,true); //borders

      sheet.getRange(rows + 1, 1, 1, 2).setBackground("#72F3FF").setFontWeight("Bold")

      //set number format to be $0.00
      sheet.getRange(row+1, cur+1, rows, val[0].length).setNumberFormat("$#,##0.00")
      
      sheet.getRange(col, cur, 1, 2).clearContent().clearFormat()
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

// create a new sheet for a new month from template
function createNewSheet(){
  var date = new Date(Date.now()) //gets current date
  date = Utilities.formatDate(date,"SGT", "MMMM yyyy") //format it to July 2025
  var source = SpreadsheetApp.openById(Sheet_Id);

  //checks if sheet already exists
  if (!source.getSheetByName(date)){
    var sheet = source.getSheetByName('Template');
    sheet.copyTo(source).setName(date);// create a sheet from template sheet
  }
  return
}