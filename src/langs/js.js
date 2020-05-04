const {Docker} = require('node-docker-api');
const crypto = require('crypto')
const fs = require('fs').promises
module.exports = run(code, config) {
    return new Promise(async (resolve, reject)=>{
        const docker = new Docker({ socketPath: config.docker_path });
        const id = crypto.randomBytes(256).toString('hex')
        await fs.mkdir('../run/'+id)
        await fs.writeFile('../run/'+id+'/prog.js', code)

        startTime = Date.now()

        const container = docker.container.create({
          Image: 'node:latest-alpine',
          name: config.prefix + id
        })
        container.logs({
            follow: true,
            stdout: true,
            stderr: true
        }).then(stream => {
            stream.on('data', info => console.log(info))
            stream.on('error', err => console.log(err))
        })
        resolved = false
        setTimeout(()=>{
            if(resolved) {
                container.stop()
                container.delete()
            } else {
                container.stop()
                container.delete()
                resolve("Timed out")
            }
        }, config.timeout)
    })
}
