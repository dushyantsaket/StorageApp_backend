"use strict";

var Buffer = require("buffer").Buffer;
var SlowBuffer = require("buffer").SlowBuffer || Buffer;

module.exports = bufferEq;

function bufferEq(a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  var result = 0;
  for (var index = 0; index < a.length; index++) {
    result |= a[index] ^ b[index];
  }
  return result === 0;
}

bufferEq.install = function () {
  Buffer.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {
    return bufferEq(this, that);
  };
};

var originalBufferEqual = Buffer.prototype.equal;
var originalSlowBufferEqual = SlowBuffer.prototype.equal;
bufferEq.restore = function () {
  Buffer.prototype.equal = originalBufferEqual;
  SlowBuffer.prototype.equal = originalSlowBufferEqual;
};