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
const font = new Font("Menlo", 11)
const widget = createWidget(data)
Script.setWidget(widget)
Script.complete()


function createWidget(data) {
  const w = new ListWidget()
  const bgColor = new LinearGradient()
  bgColor.colors = [new Color("#29323c"), new Color("#1c1c1c")]
  bgColor.locations = [0.0, 1.0]
  w.backgroundGradient = bgColor
  w.setPadding(12, 10, 10, 12)
  w.spacing = 6
  var total = data.pop()
  for(let i=0; i < data.length-1; i+=2){
    let first = pad(`${data[i][0]}`,`~$ ${data[i][1].toFixed(2)}`)
    let second = pad(`${data[i+1][0]}`,`~$ ${data[i+1][1].toFixed(2)}`)
    addRow(w, first , second)
  };
  if (data.length % 2 == 1){
    var last = data.pop()
    addRow(w, pad(`${last[0]}`,`~$ ${last[1].toFixed(2)}`),"")
  }
  w.addSpacer()
  let row = w.addStack()
  row.spacing = 0;
  var left = row.addText(pad(`Total`,`~$ ${total[1].toFixed(2)}`))
  left.textColor = new Color(monokaiPro.shift())
  left.font = font
  return w
}

async function fetchData() {
  const url = "https://script.google.com/macros/s/AKfycbzQ9s5CGWXzNxdA3pmSK6WrJG7fMgPm9C5RVaPxI_dHzGDUNGGxB4Qvn8_MhjcyBnvG3w/exec"
  const request = new Request(url)
  const res = await request.loadJSON()
  return res.data
}

function pad(first, second){
  let mpad = ' '.repeat(14-first.length)
  let rpad = ' '.repeat(18-second.length)
  return (first + mpad + second + rpad)
}

function addRow(parent, first, second){
  let row = parent.addStack()
  row.spacing = 0;
  var left = row.addText(first)
  left.textColor = new Color(monokaiPro.pop())
  left.font = font
  var right = row.addText(second)
  right.textColor = new Color(monokaiPro.pop())
  right.font = font
}