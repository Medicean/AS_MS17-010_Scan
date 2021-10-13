const UI = require('./libs/ui');
const SCANNER = require('./libs/scanner');

class Plugin {
  constructor(opts) {
    opts.map((opt) => {
      new UI(opt)
        .onScan((argv) => {
          return new SCANNER(opt, argv);
        })
    })
  }
}

module.exports = Plugin;
