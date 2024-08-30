module.exports = {
    apps: [
        {
            name: 'seiun_sodou',
            port: '3000',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs'
        }
    ]
}
