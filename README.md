# Invitation-Approval
Used in conjunction with [actions-parse-issue](https://github.com/jasonmacgowan/parse-issue), [add_invite_user](https://github.com/froi/add_invite_user), [add-comment-action](https://github.com/ActionsDesk/add-comment-action), and [close-issue-action](https://github.com/ActionsDesk/close-issue-action) to complete the user invitation/approval process.  
This action in particular fulfills the approval process where a non-allowed email is requested. It will give the approvers the option of allowing the email to be invited into the organization.

## Usage

```
on:
  issue_comment:
    types: [ created ]

jobs:
  SampleWorkflow:
    runs-on: ubuntu-latest
    steps:
      - uses: ActionsDesk/invitation_approval@release/v1
        env:
          GITHUB_TOKEN: ${{ secrets.ADMIN_TOKEN }}
        with:
          approvers: 'Chocrates'
          EMAIL_REGEX: '(.*?)'
          USER_ROLE: 'direct_member'
```

## Environment Variables  

* `GITHUB_TOKEN`: Personal Access Token (PAT) of a member of the organization that has privileges to close issues

### Why is this needed  
The action needs to create an Octokit context that has permissions to update issues (in this case simply updating the state)

## Inputs  
* `approvers`: The comma separated list of approvers.  Must match the user names exactly without the `@` sign
* `EMAIL_REGEX`: The regex used to grab the email from the original issue body.  This should match the regex used by [actions-parse-issue](https://github.com/jasonmacgowan/parse-issue) assuming it is used.  It needs to have a capture group surrounding the actual email itself
* `USER_ROLE`: Optionally describes the role to invite the user with, defaults to `direct_member`
## Contributing
See anything you would like to help with?  Please submit PR's, and ensure you write tests covering your new functionality.  (CI and a more complete test suite to be written :smile: )

## License
All code and documentation in this repository are licensed under the [MIT](LICENSE)


