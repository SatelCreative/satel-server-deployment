# Satel Server Deployment
This centralized GitHub action deploys server for a webapp

## Usage 
```yml
name: "Docker up"
on:
  pull_request:
    types:
      - opened
  push:
    tags:
      - "*"
    branches:
      - main  
    
    build-server:
    name: Build server
    needs: [generate-variables, build-client]
    runs-on: <host_name>
    steps:
    - name: Build Docker  
        uses: SatelCreative/satel-server-deployment@feature/webapp-deployment-shell
        with:
          app-name: <app-name>  
          registry: ${{ steps.registry-push.outputs.registry }}
          clean-branch-name: ${{ steps.registry-push.outputs.clean_branch_name }}
```          

- `host_name` is `self-hosted` or the name of server where the action runner is hosted, `cosmicray` for example
- `app-name` can be `st-pim` or `sb-pim` for example and it's optional
- `registry` & `clean-branch-name` parameter is set in a previous step  