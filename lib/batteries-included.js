// batteries-included.js

this.batteriesIncluded = function () {

  function batteriesIncluded() {
  }

  var slice = Array.prototype.slice;

  // Function.prototype.bind for ie8
  if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(ctx) {
      var args = slice.call(arguments, 1);
      var fn = this;
      return function () {
        return fn.apply(ctx, slice.call(args).concat(slice.call(arguments)));
      };
    };
  }

  // isPromise
  function isPromise(p) {
    return p && typeof p.then === 'function';
  }
  batteriesIncluded.isPromise = isPromise;

  // isIterator(iter)
  function isIterator(iter) {
    return iter && (typeof iter.next === 'function' || isIterable(iter));
  }
  batteriesIncluded.isIterator = isIterator;

  // isIterable(iter)
  function isIterable(iter) {
    return iter && typeof Symbol === 'function' && Symbol &&
           Symbol.iterator && typeof iter[Symbol.iterator] === 'function';
  }
  batteriesIncluded.isIterable = isIterable;

  // makeArrayFromIterator(iter or array)
  function makeArrayFromIterator(iter) {
    if (iter instanceof Array) return iter;
    if (!isIterator(iter)) return [iter];
    if (isIterable(iter)) iter = iter[Symbol.iterator]();
    var array = [];
    try {
      for (;;) {
        var val = iter.next();
        if (val && val.hasOwnProperty('done') && val.done) return array;
        if (val && val.hasOwnProperty('value')) val = val.value;
        array.push(val);
      }
    } catch (error) {
      return array;
    }
  }
  batteriesIncluded.makeArrayFromIterator = makeArrayFromIterator;

  // defProp
  var defProp = function (obj) {
    if (!Object.defineProperty) return null;
    try {
      Object.defineProperty(obj, 'prop', {value: 'str'});
      return obj.prop === 'str' ? Object.defineProperty : null;
    } catch (err) { return null; }
  } ({});
  batteriesIncluded.defProp = defProp;

  // setConst(obj, prop, val)
  var setConst = defProp ?
    function setConst(obj, prop, val) {
      defProp(obj, prop, {value: val}); } :
    function setConst(obj, prop, val) { obj[prop] = val; };
  batteriesIncluded.setConst = setConst;

  // setValue(obj, prop, val)
  var setValue = defProp ?
    function setValue(obj, prop, val) {
      defProp(obj, prop, {value: val,
        writable: true, configurable: true}); } :
    function setValue(obj, prop, val) { obj[prop] = val; };
  batteriesIncluded.setValue = setValue;

  if (typeof module === 'object' && module && module.exports)
    module.exports = batteriesIncluded.batteriesIncluded = batteriesIncluded;

  return batteriesIncluded;

}();
