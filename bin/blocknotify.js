#!/usr/bin/env node

var exec = require('child_process').execSync

const CLI = '$HOME/bitmark/src/bitmark-cli'
const NOTIFY = '$HOME/remote/github.com/melvincarvalho/skill-notify/bin/update.js'

function getNewTx() {

  var tx = exec(`${CLI} getblockchaininfo |  grep best`).toString()

  tx = tx.split('"')[3]

  var next = exec(`${CLI} getblock ${tx}`).toString()

  console.log(next)

  return next


}

function getTx(tx) {
  return exec(`
  RAWTX=$(${CLI} getrawtransaction "${tx}") ;
  DECODED=$(${CLI} decoderawtransaction $RAWTX ) ;
  echo "$DECODED"
  
  `)
}


var json = JSON.parse(getNewTx())

console.log(json.tx)

for (var i = 0; i < json.tx.length; i++) {
  var tx = JSON.parse(getTx(json.tx[0]))
  console.log(tx.vin[0])
  if (!tx.vin[0].txid) continue

  var cmd = '${NOTIFY} gitmark:' + tx.vin[0].txid + ':0 '
  console.log(cmd)
  exec(cmd)
}