module.exports = {
  apps: [{
    name: 'jobdesc_api',
    script: 'src/server/bin/www',
    watch: false,
    ignore_watch: ['/app/node_modules', '/app/.postgres-data']
  }]
}
