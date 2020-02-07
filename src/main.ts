import * as core from "@actions/core";
import * as github from "@actions/github";
import { WebhookPayload } from "@actions/github/lib/interfaces";
import outdent from "outdent";

function getEmail(issueBody: string, regexString: string): string {
  const emailRegex = new RegExp(regexString);

  const match = issueBody.match(emailRegex);

  if (match && match[1]) {
    // Return the first capture group
    return match[1];
  } else {
    throw Error("No valid email matches");
  }
}

async function run(): Promise<void> {
  try {
    const GITHUB_TOKEN: string = process.env.GITHUB_TOKEN || "";
    const repository: string = process.env.GITHUB_REPOSITORY;
    if (GITHUB_TOKEN) {
      const octokit: github.GitHub = new github.GitHub(GITHUB_TOKEN);
      const payload: WebhookPayload = github.context.payload;
      const [owner, repo] = repository.split("/");
      const { comment } = payload;

      const approvers: string = core.getInput("approvers");
      const emailRegex: string = core.getInput("EMAIL_REGEX");
      const userRole: string = core.getInput("USER_ROLE") || "direct_member";

      core.debug(`Checking if the body contains approve: ${comment.body}`);
      if (comment.body.contains("approve")) {
        core.debug(
          `Checking if the approvers are good: ${comment.user.login}: ${approvers}`
        );
        if (approvers.split(",").includes(comment.user.login)) {
          // read issue body
          const issue = payload.issue;

          // parse email
          const email = getEmail(issue.body, emailRegex);

          core.debug(`The email ${email}`);

          // invite email
          try {
            await octokit.orgs.createInvitation({
              org: owner,
              role: userRole as any,
              email
            });

            const commentBody: string = outdent`## Outcome
:white_check_mark: User with email ${email} has been invited into the org.`;

            await octokit.issues.createComment({
              owner,
              repo,
              issue_number: issue.number,
              body: commentBody
            });

            await octokit.issues.addLabels({
              owner,
              repo,
              issue_number: issue.number,
              labels: ["processed"]
            });

            await octokit.issues.update({
              owner,
              repo,
              issue_number: issue.number,
              state: "closed"
            });
          } catch (error) {
            await octokit.issues.addLabels({
              owner,
              repo,
              issue_number: issue.number,
              labels: ["automation-failed"]
            });
            throw error;
          }
        } else {
          throw new Error(
            `User: ${comment.user.login} is not in the approvers list`
          );
        }
      } else {
        return;
      }
    } else {
      core.debug("you dont have a token");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

if (!module.parent) {
  run();
}

export { run };
