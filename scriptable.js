const data = await fetchData()
var monokaiPro = [
  '#F8F8F2',
  '#FDFDFD',
  '#FCFCFA',
  '#E0E0E0',
  '#BEBEBE',
  '#A0A0A0',
  '#F5E6CC',
  '#FFD700',
  '#FFEA00',
  '#FFFF33',
  '#ADFF2F',
  '#BFFF80',
  '#98FB98',
  '#66D9EF',
  '#87CEEB',
  '#ADD8E6',
  '#F92672',
  '#FF69B4',
  '#FFB6C1',
  '#E6DB74'
];
const widget = createWidget(data)
Script.setWidget(widget)
Script.complete()


function createWidget(data) {
  const w = new ListWidget()
  const bgColor = new LinearGradient()
  bgColor.colors = [new Color("#29323c"), new Color("#1c1c1c")]
  bgColor.locations = [0.0, 1.0]
  w.backgroundGradient = bgColor
  w.setPadding(12, 15, 15, 12)
  w.spacing = 6
  const COLUMN_WIDTH = 21
  var total = data.pop()
  for(let i=0; i < data.length-1; i+=2){
    let first = padLeft(`${data[i][0]} ~$ ${data[i][1].toFixed(2)}`, COLUMN_WIDTH)
    let second = `${data[i+1][0]} ~$ ${data[i+1][1].toFixed(2)}`
    addRow(w, first , second)
  };
  if (data.length % 2 == 1){
    var last = data.pop()
    addRow(w, `${last[0]} ~$ ${last[1].toFixed(2)}`,"")
  }
  w.addText("-".repeat(30))
    addRow(w, `Total ~$ ${total[1].toFixed(2)}`,"")
  return w
}

async function fetchData() {
  const url = "https://script.google.com/macros/s/AKfycbzQ9s5CGWXzNxdA3pmSK6WrJG7fMgPm9C5RVaPxI_dHzGDUNGGxB4Qvn8_MhjcyBnvG3w/exec"
  const request = new Request(url)
  const res = await request.loadJSON()
  return res.data
}

function padLeft(str, length){
  let pad = ' '.repeat(length)
  return (str + pad).substring(0, pad.length)
}

function addRow(parent, first, second){
  let row = parent.addStack()
  row.spacing = 0;
  var left = row.addText(first)
  left.textColor = new Color(monokaiPro.pop())
  left.font = new Font("Menlo",10)
  var right = row.addText(second)
  right.textColor = new Color(monokaiPro.pop())
  right.font = new Font("Menlo",10)
}