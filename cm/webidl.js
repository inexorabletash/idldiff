(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  var RE_IDENTIFIER = /^_?[A-Za-z][0-9A-Z_a-z-]*/;

  var keywords = [
    'attribute',
    'callback',
    'const',
    'creator',
    'deleter',
    'dictionary',
    'enum',
    'getter',
    'implements',
    'inherit',
    'inherit',
    'interface',
    'iterable',
    'legacycaller',
    'legacyiterable',
    'maplike',
    'optional',
    'or',
    'partial',
    'readonly',
    'required',
    'serializer',
    'setlike',
    'setter',
    'static',
    'stringifier',
    'typedef',
    'void'
  ];

  var RE_KEYWORDS = new RegExp('^(' + keywords.join('|') + ')');

  function tokenBase(stream, state) {
    if (stream.match(/^\[/)) {
      state.tokenize = tokenExtendedAttribute;
      return 'extendedAttribute';
    }

    if (stream.match(/^-?(([0-9]+\.[0-9]*|[0-9]*\.[0-9]+)([Ee][+-]?[0-9]+)?|[0-9]+[Ee][+-]?[0-9]+)/) ||
        stream.match(/^-?([1-9][0-9]*|0[Xx][0-9A-Fa-f]+|0[0-7]*)/) ||
        stream.match(/^(-Infinity|Infinity|NaN)/))
      return 'number';

    if (stream.match(/^"[^"]*"/))
      return 'string';

    if (stream.match(/^(true|false)/))
      return 'boolean';

    if (stream.match(RE_KEYWORDS))
      return 'keyword';

    if (stream.match(RE_IDENTIFIER))
      return 'identifier';

    // Handle non-detected items
    stream.next();
    return 'operator';
  };

  function tokenComment(stream, state) {
    if (stream.match(/^\*\//)) {
      state.blockComment = false;
    } else {
      stream.next();
    }
    return "comment";
  }

  function tokenExtendedAttribute(stream, state) {
    // TODO: handle comments in extended attributes
    if (stream.match(/^\]/)) {
      state.tokenize = null;
      return 'extendedAttribute';
    } else if (stream.match(/^_?[A-Za-z][0-9A-Z_a-z-]*/)) {
      return 'extendedAttributeIdentifier';
    } else {
      stream.next();
      return 'extendedAttributeOperator';
    }
  }

  CodeMirror.defineMode('webidl', function() {
    return {
      startState: function() {
        return {
          tokenize: null,
          blockComment: false
        };
      },

      token: function(stream, state) {
        if (state.blockComment)
          return tokenComment(stream, state);

        if (stream.eatSpace()) return null;

        if (stream.match(/^\/\*/)) {
          state.blockComment = true;
          return 'comment';
        }

        if (stream.match(/^\/\//)) {
          stream.skipToEnd();
          return "comment";
        }

        return (state.tokenize || tokenBase)(stream, state);
      },

      // For commenting add-on
      blockCommentStart: '/*',
      blockCommentEnd: '*/',
      lineComment: '//'
    };
  });

  CodeMirror.defineMIME('text/x-webidl', 'webidl');
});
