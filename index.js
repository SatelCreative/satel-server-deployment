const core = require('@actions/core');
const exec = require("@actions/exec");

async function run() {
    try {
        const appName = core.getInput('app-name');
        const serverPath = core.getInput('server-dir');
        const dockerUser = core.getInput('docker-user');
        const dockerPass = core.getInput('docker-pass');
        const registry = core.getInput('registry');
        const dockerfile = core.getInput('dockerfile')
        const currentBranchName = core.getInput('current-branch-name');
        const tagName = core.getInput('tag-name');
        const src = __dirname;
        await exec.exec(`${src}/deploy_server.sh  ${appName} ${serverPath} ${dockerUser} ${dockerPass} ${registry} ${dockerfile} ${currentBranchName} ${tagName}`) ;
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();