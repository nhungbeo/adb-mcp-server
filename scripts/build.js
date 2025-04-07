const { exec } = require('child_process');
const path = require('path');

const buildDir = path.resolve(__dirname, '../src');
const outputDir = path.resolve(__dirname, '../dist');

exec(`tsc --outDir ${outputDir} ${buildDir}/*.ts`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error during build: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Build stderr: ${stderr}`);
        return;
    }
    console.log(`Build stdout: ${stdout}`);
    console.log('Build completed successfully.');
});