const {exec} = require("child_process")
const fs = require('fs').promises

async function main() {
    const files = (await fs.readdir(__dirname)).filter(file=>!file.endsWith('.js'))

    files.forEach(file=>{
        console.log('[Dockerfiles INIT] Building '+file+'...')
        exec("docker build - < "+__dirname+"/"+file+" -t coderequest-"+file, null, (err, stdout, stderr)=>{

            if(stderr) {
                console.error('[Dockerfiles INIT] Unable to build '+file)
                console.error(stderr)
            } else console.log('[Dockerfiles INIT] '+file+' built.')
        })
    })
}
main()
