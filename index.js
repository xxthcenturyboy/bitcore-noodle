console.log('\n'); // print newline to separate different runs

var bitcore = require('bitcore-lib');
// var explorers = require('bitcore-explorers');
var Transaction = bitcore.Transaction;

var privateKeyWIF = 'cTs6agk2njhAnfvixKV4Xq6vrqTNxuB18apm3DUjzXMDngsnRNqr';

var privateKey = bitcore.PrivateKey.fromWIF(privateKeyWIF);
var address = privateKey.toAddress();
// console.log('address:', address);

var value = new Buffer('this is a way to generate an address from a string--risky--not random--guessable!!!');
var hash = bitcore.crypto.Hash.sha256(value);
var bn = bitcore.crypto.BN.fromBuffer(hash);
var address2 = new bitcore.PrivateKey(bn,'testnet').toAddress();
// console.log('address2:', address2);

var Insight = require('bitcore-explorers').Insight;
var insight = new Insight('testnet');

insight.getUnspentUtxos(address, function(err, utxos) {
  if (err) {
    // Handle errors...
    console.log('error getting unspent outputs')
  } else {
    // use the UTXOs to create a transaction
    // console.log(utxos);
    var tx = bitcore.Transaction();
    tx.from(utxos);
    tx.to(address2, 10000); // .0001 BTC
    tx.change(address); // recommend new address here for better privacy
    tx.fee(50000);
    tx.sign(privateKey);

    // console.log('transaction:');
    // console.log(tx.toObject());

    // tx.serialize();
    // // alternate way to broadcast transaction.
    // // paste at https://test-insight.bitpay.com/tx/send
    // console.log('serialized output:');
    // console.log(tx.serialize());

    // script printing
    // var scriptIn = bitcore.Script(tx.toObject().inputs[0].script);
    // console.log('input script string: ');
    // console.log(scriptIn.toString());
    // var scriptOut = bitcore.Script(tx.toObject().outputs[0].script);
    // console.log('output script string: ');
    // console.log(scriptOut.toString());

    // Store data in a transaction (up to 80 bytes, amount sent can
    // never be spent)
    // tx.addData()

    // broadcast using bitpay's insight server
    console.log(tx, tx instanceof Transaction);
    insight.broadcast(tx, function(err, returnedTxId) {
      if (err) {
        // Handle errors...
        console.log(err);
      } else {
        // Mark the transaction as broadcasted
        console.log('sucessful broadcast: ' + returnedTxId);
      }
    });
  }
});
