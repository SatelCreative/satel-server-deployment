const core = require('@actions/core');
const exec = require("@actions/exec");

async function run() {
    try {
        const appName = core.getInput('app-name');
        const registry = core.getInput('registry');
        const clean_branch_name = core.getInput('clean-branch-name');
        const src = __dirname;
        await exec.exec(`${src}/deploy_server.sh  ${appName} ${registry} ${clean_branch_name}`) ;
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();