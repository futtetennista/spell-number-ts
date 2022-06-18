"use strict";
exports.__esModule = true;
exports.server = void 0;
var express_1 = require("express");
var app = (0, express_1["default"])();
var port = 3000;
app.get("/", function (req, res) {
  var inputQ = req.query;
  console.log(inputQ);
  var input = parseInt(inputQ["input"]);
  var inputParsed = parseNumber(input);
  res.send("".concat(inputParsed));
});
exports.server = app.listen(port);
exports["default"] = exports.server;
var powersOfTen = [1, 2, 3, 4];
var powerOfTenToUnit = { 1: "unit", 2: "tens", 3: "hundreds", 4: "thousands" };
var getUnit = function (x, i) {
  var n = Math.floor((x % Math.pow(10, i)) / Math.pow(10, i - 1));
  var u = powerOfTenToUnit[n];
  return { n: n, u: u };
};
var parseNumber = function (x) {
  return powersOfTen.map(function (i) {
    return getUnit(x, i);
  });
};
