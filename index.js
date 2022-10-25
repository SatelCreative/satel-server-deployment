const core = require('@actions/core');
const exec = require("@actions/exec");

async function run() {
    try {
        const appName = core.getInput('app-name');
        const serverPath = core.getInput('server-dir');
        const satelDockerUser = core.getInput('satel-docker-user');
        const satelDockerPass = core.getInput('satel-docker-pass');
        const clientDockerUser = core.getInput('client-docker-user');
        const clientDockerPass = core.getInput('client-docker-pass');
        const satelRegistry = core.getInput('satel-registry');
        const clientRegistry = core.getInput('client-registry');
        const dockerfile = core.getInput('dockerfile')
        const currentBranchName = core.getInput('current-branch-name');
        const tagName = core.getInput('tag-name');
        const src = __dirname;
        await exec.exec(`${src}/deploy_server.sh  ${appName} ${serverPath} ${satelDockerUser} ${satelDockerPass} ${clientDockerUser} ${clientDockerPass} ${satelRegistry} ${clientRegistry} ${dockerfile} ${currentBranchName} ${tagName}`) ;
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();