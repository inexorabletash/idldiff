# idldiff
Extremely basic visual [WebIDL](heycam.github.io/webidl/) comparison tool

Use it live at:

https://inexorabletash.github.io/idldiff/

## Instructions

* The top left/right panels are [CodeMirror](http://codemirror.net/) editors that do very basic 
  syntax highlighting of WebIDL files
* Type or paste WebIDL in the left and right panels
* The WebIDL will be validated using [webidl2.js](https://github.com/darobin/webidl2.js/)
  * The first error encountered will be shown at the bottom, with the offending line highlighted
* If both left and right WebIDL is valid, the parsed results (AST structures) will be compared
  and some differences reported. The diff mechanism is really dumb - basically just a recursive
  JS comparison function.
  
Caveats:

* The diff report is extremely dumb. 
* By default, member order for interfaces is ignored. This is to facilitate testing that
  reordering/commenting existing WebIDL files has not changed anything. To override this,
  load the page with `?order` as a query parameter.
* [webidl2.js](https://github.com/darobin/webidl2.js/) is missing support for some newer
  [WebIDL](heycam.github.io/webidl/) syntax such as `iterable<>`.

## Hacking on it

To hack on it or host it locally, clone including submodules:

  git clone --recursive git://github.com/inexorabletash/idldiff.git
  
Or:

  git clone git://github.com/inexorabletash/idldiff.git
  cd idldiff
  git submodule update --init --recursive

Then just fire up a web server in the directory and load `index.html`
