const RunnerManager = require('./RunnerManager.js')

module.exports = class Bind {
        constructor(config, self) {
            this.config = config
            this.self = self
        }
        run(code) {
            this.runnerManager = new RunnerManager({
                image: this.self.image,
                config: this.config,
                commands: this.self.commands,
                filename: this.self.filename,
                code
            })
            return new Promise((resolve, reject)=>{
                this.runnerManager.on('close', (code, sig, stdout, stderr, fullData, output)=>{
                    return resolve(`
${fullData}

${output}
`)
                })
                this.runnerManager.run()
            })
        }
}
