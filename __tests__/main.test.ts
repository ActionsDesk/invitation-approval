/* global octomock */
import { run } from "../src/main";
let issueNumber = 1;
let login = "User";
let name = "RepoName";
beforeAll(() => {
  process.env.GITHUB_TOKEN = "token";
  let context = octomock.getContext();
  context.payload = {
    action: "created",
    comment: {
      body: "approve and also stuff",
      user: {
        login: "User"
      }
    },
    enterprise: {
      name: "EnterpriseName"
    },
    issue: {
      body: "<p>Email of Requester: Email@Yahoo.com</p>",
      number: issueNumber
    },
    organization: {
      login: login
    },
    repository: {
      name: name
    }
  };
  octomock.updateContext(context);

  octomock.mockFunctions.getInput
    .mockReturnValueOnce("User")
    .mockReturnValueOnce("<p>Email of Requester:s*(.*?)</p>")
    .mockReturnValueOnce("direct_member");
});

describe("Main", () => {
  it("Finds an approve comment and invites the user", async () => {
    await run();
    expect(octomock.mockFunctions.createInvitation).toHaveBeenCalledTimes(1);
    expect(octomock.mockFunctions.createComment).toHaveBeenCalledTimes(1);
    expect(octomock.mockFunctions.addLabels).toHaveBeenCalledTimes(1);
    expect(octomock.mockFunctions.addLabels).toHaveBeenCalledWith({
      owner: login,
      repo: name,
      issue_number: issueNumber,
      labels: ["processed"]
    });

    expect(octomock.mockFunctions.update).toHaveBeenCalledTimes(1);
    expect(octomock.mockFunctions.update).toHaveBeenCalledWith({
      owner: login,
      repo: name,
      issue_number: issueNumber,
      state: "closed"
    });
  });
  it("Finds an approve comment and errors when the user is not in the approved list", async () => {
    let context = octomock.getContext();
    context.payload.comment.user.login = "Not a valid user";
    octomock.updateContext(context);
    await run();
    expect(octomock.mockFunctions.createInvitation).toHaveBeenCalledTimes(0);
    expect(octomock.mockFunctions.setFailed).toHaveBeenCalledTimes(1);
    expect(octomock.mockFunctions.setFailed).toHaveBeenCalledWith(
      `User: Not a valid user is not in the approvers list`
    );
  });

  it("No approve comment no action is done", async () => {
    let context = octomock.getContext();
    context.payload.comment.body =
      "I have something valid to add to this conversation :squid:";
    octomock.updateContext(context);
    await run();
    expect(octomock.mockFunctions.createInvitation).toHaveBeenCalledTimes(0);
    expect(octomock.mockFunctions.setFailed).toHaveBeenCalledTimes(0);
  });
});
