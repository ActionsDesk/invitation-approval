/* global octomock */
import { run } from "../src/main";
let issueNumber = 1;
let login = "User";
let name = "RepoName";
beforeAll(() => {
  process.env.GITHUB_TOKEN = "token";
  let context = octomock.getContext();
  context.payload = {
    repository: {
      owner: {
        login: login
      },
      name: name
    },
    issue: {
      number: issueNumber
    }
  };
  octomock.updateContext(context);
});

describe("Main", () => {
  it("Gets the issue and closes it", async () => {
    await run();
    expect(octomock.mockFunctions.update).toHaveBeenCalledTimes(1);
    expect(octomock.mockFunctions.update).toHaveBeenCalledWith({
      owner: login,
      repo: name,
      issue_number: issueNumber,
      state: "closed"
    });
  });
});
