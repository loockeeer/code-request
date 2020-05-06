const {exec} = require("child_process")
const fs = require('fs').promises

async function main() {
    const files = (await fs.readdir('.')).filter(file=>!file.endsWith('.js'))

    files.forEach(file=>{
        console.log('[Dockerfiles INIT] Building '+file+'...')
        exec("docker build - < ./"+file+" -t docker_api_code_runner-"+file, null, (err, stdout, stderr)=>{
            console.log('[Dockerfiles INIT] '+file+' built.')
        })
    })
}
