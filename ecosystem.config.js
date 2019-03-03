module.exports = {
  apps: [{
    name: 'triposse',
    script: './bin/www'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-13-234-59-206.ap-south-1.compute.amazonaws.com',
      key: '~/.ssh/web.pem',
      ref: 'origin/master',
      repo: 'git@github.com:triposse/tp-web.git',
      path: '/home/ubuntu/code',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
