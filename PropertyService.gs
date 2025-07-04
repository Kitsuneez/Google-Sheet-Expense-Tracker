function AddKeys(){
  var scriptProperties = PropertiesService.getScriptProperties();

  // replace SHEET_ID with your own
  // https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit?gid=0#gid=0
  scriptProperties.setProperty("SHEET_ID", "<SHEET_ID>");
}
