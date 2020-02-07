# close-issue-action
A simple action that closes the issue.  Intended for use with issue events as part of a larger composable workflow.

## Usage

```
on:
  issues:
    types: [ opened ]

jobs:
  SampleWorkflow:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Close Issue
        uses: chocrates/close-issue-action@release/v1
        env:
          GITHUB_TOKEN: ${{ secrets.ADMIN_TOKEN }}
```

## Environment Variables  

* `GITHUB_TOKEN`: Personal Access Token (PAT) of a member of the organization that has privileges to close issues

### Why is this needed  
The action needs to create an Octokit context that has permissions to update issues (in this case simply updating the state)

## Contributing
See anything you would like to help with?  Please submit PR's, and ensure you write tests covering your new functionality.  (CI and a more complete test suite to be written :smile: )

## License
All code and documentation in this repository are licensed under the [# close-issue-action


