module.exports = {
  apps: [{
    name: 'triposse',
    script: './bin/www'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-13-126-205-91.ap-south-1.compute.amazonaws.com',
      key: '~/.ssh/triposse.pem',
      ref: 'origin/master',
      repo: 'git@github.com:triposse/tp-web.git',
      path: '/home/ubuntu/triposse-server',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
