class Logger {
  enable() {
    this.enabled = true;
  }

  info() {
    if(this.enabled) {
      let args = Array.prototype.slice.call(arguments)
      let msg = args.shift()

      if(args.length == 0) {
        console.log("%c %s", "color:gray", msg)
      } else if(args.length == 1) {
        console.log("%c %s %o", "color:gray", msg, args[0])
      } else {
        console.log("%c %s %o", "color:gray", msg, args)
      }
    }
  }
}

export default new Logger();
