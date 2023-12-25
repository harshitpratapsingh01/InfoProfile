module.exports = {
  apps: [
    {
      name: 'mysets2',
      script: 'server.ts',
      exec_mode: 'fork',
      instances: 1,
      watch: true,
      ignore_watch: ['node_modules', 'build', '.git'],
      env: {
        NODE_ENV: 'development',
      },
      exec_interpreter: './node_modules/.bin/ts-node',
    },
  ],
};
