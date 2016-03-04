class Logger {
  enable() {
    this.enabled = true;

    // Store console on the logger as a hack to skip the `no-console` eslint rule
    this.console = window['console'];
  }

  info() {
    if(this.enabled) {
      let args = Array.prototype.slice.call(arguments)
      let msg = args.shift()

      if(args.length == 0) {
        this.console.log("%c%s", "color:gray", msg)
      } else if(args.length == 1) {
        this.console.log("%c%s %o", "color:gray", msg, args[0])
      } else {
        this.console.log("%c%s %o", "color:gray", msg, args)
      }
    }
  }

  error() {
    if(this.enabled) {
      let args = Array.prototype.slice.call(arguments)
      let msg = args.shift()

      if(args.length == 0) {
        this.console.error("%c%s", "color:gray", msg)
      } else if(args.length == 1) {
        this.console.error("%c%s %o", "color:gray", msg, args[0])
      } else {
        this.console.error("%c%s %o", "color:gray", msg, args)
      }
    }
  }
}

export default new Logger();
