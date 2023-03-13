const homedir = require('os').homedir()
const home = process.env.HOME || homedir
const p = require('path')
const dbPath = p.join(home, '.todo')
const fs = require('fs')

const db = {
    read(path = dbPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, {flag: 'a+'}, (error, data) => {
                if (error) {
                    reject(error)
                } else {
                    let list
                    try {
                        list = JSON.parse(data.toString())
                    } catch (error2) {
                        list = []
                    }
                    resolve(list)
                }
            })
        })
    },
    write(list, path = dbPath) {
        return new Promise((resolve, reject) => {
            const srting = JSON.stringify(list)
            fs.writeFile(path, srting + '\n', (error) => {
                if (error) {
                    return reject(error)
                }
                resolve()
            })
        })
    },
}

module.exports = db
