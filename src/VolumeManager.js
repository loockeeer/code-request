const fs = require('fs').promises
module.exports = class VolumeManager {
    constructor({id, filename, code}) {
        this.id = id
        this.filename = filename
        this.code = code
    }
    async createFolder() {
        await fs.mkdir(__dirname+'/run/'+this.id)
        await fs.writeFile(__dirname+'/run/'+this.id+'/'+this.filename, this.code)
    }
    async removeFolder() {
        await fs.rmdir(__dirname+'/run/'+this.id, {recursive: true})
    }
    get folder() {
        return __dirname+'/run/'+this.id
    }
}
