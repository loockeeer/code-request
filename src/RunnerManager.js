const crypto = require('crypto')
const {EventEmitter} = require('events')
const DockerRunner = require('./DockerRunner.js')
const VolumeManager = require('./VolumeManager.js')
module.exports = class RunnerManager extends EventEmitter{
    constructor({
        image,
        config,
        commands,
        filename,
        code
    }) {
        super()
        this.image = image
        this.code = code
        this.filename = filename
        this.config = config
        this.commands = commands
        this.id = crypto.randomBytes(100).toString('hex')
        this.volumeManager = new VolumeManager({id: this.id, filename: this.filename, code})
        this.dockerRunner = new DockerRunner({
            image,
            id: this.id,
            config,
            commands
        })
        this._stdout = ""
        this._stderr = ""
        this._fullData = ""
        this._startRun = 0
        this.dockerRunner.on('stdout', stdout=>{
            this.emit('stdout', stdout)
            this._fullData += stdout.toString()
            return this._stdout += stdout.toString()
        })
        this.dockerRunner.on('stderr', stderr=>{
            this.emit('stderr', stderr)
            this._fullData += stderr.toString()
            return this._stderr += stderr.toString()
        })
        this.dockerRunner.on('close', (code, sig)=>{
            const output = `
Exit code : ${code}
${sig === "SIGTERM" ? "Timed Out" : ""}
Total Time : ${(Date.now() - this._startRun)/1000}s`
            this.removeFolder()
            return this.emit('close', code, sig, this.stdout, this.stderr, this.fullData, output)
        })
    }
    createFolder() {
        return this.volumeManager.createFolder().then(()=> this)
    }
    removeFolder() {
        return this.volumeManager.removeFolder().then(()=> this)
    }
    stop() {
        this.dockerRunner.stop()
        return this
    }
    async run() {
        await this.volumeManager.createFolder()
        this._startRun = Date.now()
        await this.dockerRunner.run()
        if(this.config.timeout) setTimeout(this.stop, this.config.timeout)
        return this
    }
    get stdout() {
        return this._stdout
    }
    get stderr() {
        return this._stderr
    }
    get fullData() {
        return this._fullData
    }
}
