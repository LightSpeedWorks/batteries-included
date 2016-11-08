// batteries-included.js

this.batteriesIncluded = function () {

	function batteriesIncluded() {
	}

	var slice = Array.prototype.slice;


	// isPromise(promise)
	function isPromise(p) {
		return p && typeof p.then === 'function';
	}

	// isIterator(iter)
	function isIterator(iter) {
		return iter && (typeof iter.next === 'function' || isIterable(iter));
	}

	// isIterable(iter)
	function isIterable(iter) {
		return iter && typeof Symbol === 'function' && Symbol &&
					 Symbol.iterator && typeof iter[Symbol.iterator] === 'function';
	}

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

	// defProp(obj, prop, propDesc)
	var defProp = function (obj) {
		if (!Object.defineProperty) return null;
		try {
			Object.defineProperty(obj, 'prop', {value: 'str'});
			return obj.prop === 'str' ? Object.defineProperty : null;
		} catch (err) { return null; }
	} ({});

	// setConst(obj, prop, val)
	var setConst = defProp ?
		function setConst(obj, prop, val) {
			defProp(obj, prop, {value: val}); } :
		function setConst(obj, prop, val) { obj[prop] = val; };

	// setValue(obj, prop, val)
	var setValue = defProp ?
		function setValue(obj, prop, val) {
			defProp(obj, prop, {value: val,
				writable: true, configurable: true}); } :
		function setValue(obj, prop, val) { obj[prop] = val; };

	// getProto(obj)
	var getProto = Object.getPrototypeOf || {}.__proto__ ?
		function getProto(obj) { return obj.__proto__; } : null;

	// setProto(obj, proto)
	var setProto = Object.setPrototypeOf || {}.__proto__ ?
		function setProto(obj, proto) { obj.__proto__ = proto; } : null;

	// defGetter(obj, prop, getter)
	var defGetter = 
		Object.prototype.__defineGetter__ ?
		function defGetter(obj, prop, getter) {
			return obj.__defineGetter__(prop, getter); } :
		defProp ?
		function defGetter(obj, prop, getter) {
			return defProp(obj, prop, {get: getter}); } :
		function defGetter(obj, prop, getter) {};

	// fnameRegExp: function name regular expression
	var fnameRegExp = /^\s*function\s*\**\s*([^\(\s]*)[\S\s]+$/im;

	// Function.prototype.name for ie
	if (!Function.prototype.hasOwnProperty('name'))
		defGetter(Function.prototype, 'name',
			function nameOfFunction() {
				return ('' + this).replace(fnameRegExp, '$1'); });

	// Function.prototype.bind for ie8
	if (!Function.prototype.bind)
		Function.prototype.bind = function bind(ctx) {
			var args = slice.call(arguments, 1);
			var fn = this;
			return function () {
				return fn.apply(ctx, slice.call(args).concat(slice.call(arguments)));
			};
		};

	// Array.prototype.forEach for ie8
	if (!Array.prototype.hasOwnProperty('map'))
		Array.prototype.forEach = function forEach(fn, ctx) {
			for (var i = 0, n = this.length; i < n; ++i)
				fn.call(ctx, this[i], i, this);
		};

	// Array.prototype.map for ie8
	if (!Array.prototype.hasOwnProperty('map'))
		Array.prototype.map = function map(fn, ctx) {
			var n = this.length, res = new Array(n);
			for (var i = 0; i < n; ++i)
				res[i] = fn.call(ctx, this[i], i, this);
			return res;
		};

	// Array.prototype.filter for ie8
	if (!Array.prototype.hasOwnProperty('filter'))
		Array.prototype.filter = function filter(fn, ctx) {
			var n = this.length, res = [];
			for (var i = 0; i < n; ++i)
				fn.call(ctx, this[i], i, this) || res.push(this[i]);
			return res;
		};

	// Array.prototype.reduce for ie8
	if (!Array.prototype.reduce)
		Array.prototype.reduce = function reduce(fn, val) {
			var i = 0;
			if (arguments.length <= 1) val = this[i++];
			for (var n = this.length; i < n; ++i)
				val = fn(val, this[i], i, this);
			return val;
		};

	// Array.from
	if (!Array.from)
		Array.from = function from(list) {
			var arr = new Array(list.length);
			for (var i = 0, n = list.length; i < n; ++i)
				arr[i] = list[i];
			return arr;
		};

	// Object.keys for ie8
	if (!Object.keys)
		Object.keys = function keys(obj) {
			var props = [];
			for (var prop in obj)
				if (obj.hasOwnProperty(prop))
					props.push(prop);
			return props;
		};

	// Object.getOwnPropertyNames for ie8
	if (!Object.getOwnPropertyNames)
		Object.getOwnPropertyNames = Object.keys;

	// String.prototype.startsWith for ie
	if (!String.prototype.startsWith)
		String.prototype.startsWith = function startsWith(str) {
			return this.substr(0, str.length) === str;
		};

	// String.prototype.endsWith for ie
	if (!String.prototype.endsWith)
		String.prototype.endsWith = function endsWith(str) {
			return this.substr(-str.length) === str;
		};

	batteriesIncluded.isPromise = isPromise;
	batteriesIncluded.isIterator = isIterator;
	batteriesIncluded.isIterable = isIterable;
	batteriesIncluded.makeArrayFromIterator = makeArrayFromIterator;
	batteriesIncluded.defProp = defProp;
	batteriesIncluded.setConst = setConst;
	batteriesIncluded.setValue = setValue;
	batteriesIncluded.getProto = getProto;
	batteriesIncluded.setProto = setProto;
	batteriesIncluded.defGetter = defGetter;

	if (typeof module === 'object' && module && module.exports)
		module.exports = batteriesIncluded.batteriesIncluded = batteriesIncluded;

	return batteriesIncluded;

}();
