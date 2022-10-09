const core = require('@actions/core');
const exec = require("@actions/exec");

async function run() {
    try {
        const appName = core.getInput('app-name');
        const clientPath = core.getInput('client-dir');
        const serverPath = core.getInput('server-dir');
        const dockerUser = core.getInput('docker-user');
        const dockerPass = core.getInput('docker-pass');
        const registry = core.getInput('registry');
        const currentBranchName = core.getInput('current-branch-name');
        const tagName = core.getInput('tag-name');
        const src = __dirname;
        // console.log(src);
        await exec.exec(`${src}/git_update.sh  ${appName} ${clientPath} ${serverPath} ${dockerUser} ${dockerPass} ${registry} ${currentBranchName} ${tagName}`) ;
        // await exec.exec(`${src}/dist/git_update.sh st-pim client`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();