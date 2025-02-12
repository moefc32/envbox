require('dotenv').config();
const packageJson = require('./package.json');

module.exports = {
    apps: [
        {
            name: packageJson.name,
            script: 'build/index.js',
            env: {
                HOST: process.env.VITE_IPBIND || '127.0.0.1',
                PORT: parseInt(process.env.VITE_PORT) || 4000,
                BODY_SIZE_LIMIT: process.env.VITE_SIZE_LIMIT || '10M',
            },
        },
    ]
};
