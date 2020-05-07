const {spawn} = require("child_process")
const {EventEmitter} = require("events")
module.exports = class DockerRunner extends EventEmitter{
    constructor({image, config, id, commands}) {
        super()
        this.args = ["run"]
        this.args.push("-w","/usr/src/app")
        this.args.push("--name", id)
        
        if(config.container.permissions.network) this.args.push('--network', config.container.permissions.network ? 'bridge' : 'none')
        if(config.container.limits.cpu) this.args.push('--cpu-quota', config.container.limits.cpu*1000)
        if(config.container.limits.memory) this.args.push('-m', config.container.limits.memory)

        this.args.push("-v", `${__dirname}/run/${id}/:/usr/src/app`)
        this.args.push(image)
        this.args.push("sh", "-c", commands.join("&&"))
    }
    run() {
        this.process = spawn("docker", this.args)
        this.process.stdout.on('data', stdout=>this.emit("stdout", stdout))
        this.process.stderr.on('data', stderr=>this.emit("stderr", stderr))
        this.process.on('close', (code, sig)=>this.emit("close", code, sig))
        this.process.stdin.end()
        return this
    }
    stop() {
        this.process.kill("SIGTERM")
    }
}
