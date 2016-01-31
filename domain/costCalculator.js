/* jshint esnext: true */
/* jshint node: true */
'use strict';

const _ = require('lodash');
const config = require('config');

let calculator = {};

calculator.priceFor = function (participant) {
  let total = 0;
  if (!(_.isEmpty(participant.tshirt) || participant.tshirt.amount === 0)) {
    total = total + parseFloat(config.get('shirts.price'));
  }
  if (participant.discount === 'yes' ) {
    total = total + parseFloat(config.get('costs.discount'));
  }
  else {
    total = total + parseFloat(config.get('costs.standard'));
  }
  return total;
};

module.exports = calculator;
