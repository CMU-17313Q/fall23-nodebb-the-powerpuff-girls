/* Just enough of CodeMirror to run runMode under node.js */

function splitLines(string) { return string.split(/\r?\n|\r/); }

function StringStream(string) {
    this.pos = this.start = 0;
    this.string = string;
}
StringStream.prototype = {
    eol: function () { return this.pos >= this.string.length; },
    sol: function () { return this.pos == 0; },
    peek: function () { return this.string.charAt(this.pos) || null; },
    next: function () {
        if (this.pos < this.string.length) return this.string.charAt(this.pos++);
    },
    eat: function (match) {
        const ch = this.string.charAt(this.pos);
        if (typeof match === 'string') var ok = ch == match;
        else var ok = ch && (match.test ? match.test(ch) : match(ch));
        if (ok) { ++this.pos; return ch; }
    },
    eatWhile: function (match) {
        const start = this.pos;
        while (this.eat(match)) {}
        return this.pos > start;
    },
    eatSpace: function () {
        const start = this.pos;
        while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) ++this.pos;
        return this.pos > start;
    },
    skipToEnd: function () { this.pos = this.string.length; },
    skipTo: function (ch) {
        const found = this.string.indexOf(ch, this.pos);
        if (found > -1) { this.pos = found; return true; }
    },
    backUp: function (n) { this.pos -= n; },
    column: function () { return this.start; },
    indentation: function () { return 0; },
    match: function (pattern, consume, caseInsensitive) {
        if (typeof pattern === 'string') {
            function cased(str) { return caseInsensitive ? str.toLowerCase() : str; }
            if (cased(this.string).indexOf(cased(pattern), this.pos) == this.pos) {
                if (consume !== false) this.pos += pattern.length;
                return true;
            }
        } else {
            const match = this.string.slice(this.pos).match(pattern);
            if (match && consume !== false) this.pos += match[0].length;
            return match;
        }
    },
    current: function () { return this.string.slice(this.start, this.pos); },
};
exports.StringStream = StringStream;

exports.startState = function (mode, a1, a2) {
    return mode.startState ? mode.startState(a1, a2) : true;
};

const modes = exports.modes = {}; const
    mimeModes = exports.mimeModes = {};
exports.defineMode = function (name, mode) { modes[name] = mode; };
exports.defineMIME = function (mime, spec) { mimeModes[mime] = spec; };
exports.getMode = function (options, spec) {
    if (typeof spec === 'string' && mimeModes.hasOwnProperty(spec)) spec = mimeModes[spec];
    if (typeof spec === 'string') {
        var mname = spec;
        var config = {};
    } else if (spec != null) {
        var mname = spec.name;
        var config = spec;
    }
    const mfactory = modes[mname];
    if (!mfactory) throw new Error(`Unknown mode: ${spec}`);
    return mfactory(options, config || {});
};

exports.runMode = function (string, modespec, callback) {
    const mode = exports.getMode({ indentUnit: 2 }, modespec);
    const lines = splitLines(string); const
        state = exports.startState(mode);
    for (let i = 0, e = lines.length; i < e; ++i) {
        if (i) callback('\n');
        const stream = new exports.StringStream(lines[i]);
        while (!stream.eol()) {
            const style = mode.token(stream, state);
            callback(stream.current(), style, i, stream.start);
            stream.start = stream.pos;
        }
    }
};
