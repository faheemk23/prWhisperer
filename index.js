/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

const {
  getAllIssueComments,
  getPrFiles,
  createComment,
  getPrCommitsMessages,
  getFinalCode,
  getPistonResponse,
} = require("./utils");

module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "well done!",
    });
    return context.octokit.issues.createComment(issueComment);
  });

  app.on("issue_comment.created", async (context) => {
    const pullUrl =
      context?.payload?.issue?.pull_request?.url.split(
        "https://api.github.com"
      )[1] + "/files";

    const comments = await getAllIssueComments(context);

    const toExecute = comments
      .slice(-1)
      .some((lastComment) =>
        lastComment.trim().toLowerCase().includes("/execute")
      );

    if (toExecute) {
      createComment(
        context,
        "Hey, thanks for using prWhisperer. Here's the output of your javascript files (ending with .js)"
      );
      const files = await getPrFiles(pullUrl, context);

      // Iterate through the files and access the diff content
      for (const file of files) {
        if (file.filename.includes(".js")) {
          let finalResponse = "";
          finalResponse += `Output for ${file.filename}`;
          const code = getFinalCode(file.patch.split("@@")[2].split("\n"));
          const result = await getPistonResponse(code);

          if (result.run.stderr) {
            finalResponse =
              finalResponse +
              `\n\nPlease check your code once, it has the following error:\n\n${result?.run.stderr}`;
          } else {
            finalResponse = finalResponse + `\n\n${result?.run.stdout}`;
          }

          createComment(context, finalResponse);
        }
      }
    }
  });

  app.on("pull_request.opened", async (context) => {
    const { owner, repo, issue_number: number } = context.issue();

    const commitsMessages = await getPrCommitsMessages(context);

    const toExecute = commitsMessages.some((message) =>
      message.trim().toLowerCase().includes("/execute")
    );

    if (toExecute) {
      const pullUrl = `/repos/${owner}/${repo}/pulls/${number}/files`;

      createComment(
        context,
        "Hey, thanks for using prWhisperer. Here's the output of your javascript files (ending with .js)"
      );
      const files = await getPrFiles(pullUrl, context);

      // Iterate through the files and access the diff content
      for (const file of files) {
        if (file.filename.includes(".js")) {
          let finalResponse = "";
          finalResponse += `Output for ${file.filename}`;
          const code = getFinalCode(file.patch.split("@@")[2].split("\n"));
          const result = await getPistonResponse(code);

          if (result.run.stderr) {
            finalResponse =
              finalResponse +
              `\n\nPlease check your code once, it has the following error:\n\n${result?.run.stderr}`;
          } else {
            finalResponse = finalResponse + `\n\n${result?.run.stdout}`;
          }

          createComment(context, finalResponse);
        }
      }
    }
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
