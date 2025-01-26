const { spawn } = require('child_process');

const server = spawn('node', ['server.js'], { stdio: 'inherit' });
const client = spawn('npm', ['start'], { cwd: './client', stdio: 'inherit' });

server.on('close', (code) => console.log(`Server process exited with code ${code}`));
client.on('close', (code) => console.log(`Client process exited with code ${code}`));
