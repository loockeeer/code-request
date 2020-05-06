const fs = require('fs').promises
module.exports = class VolumeManager {
    constructor({id, filename, code}) {
        this.id = id
        this.filename = filename
        this.code = code
    }
    async createFolder() {
        await fs.mkdir('run/'+this.id)
        await fs.writeFile('run/'+this.id+'/'+this.filename, this.code)
    }
    async removeFolder() {
        await fs.rmdir('run/'+this.id, {recursive: true})
    }
    get folder() {
        return 'run/'+this.id
    }
}
