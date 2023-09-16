/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

// const { default: piston } = require("piston-client");

async function getAllIssueComments(context) {
  const { owner, repo, issue_number: number } = context.issue();

  try {
    const comments = await context.octokit.request(
      "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: owner,
        repo: repo,
        issue_number: number,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const commentsData = comments.data.map(({ body }) => body);

    return commentsData;
  } catch (error) {
    console.error(error);
  }
}

async function getPrFiles(url, context) {
  try {
    const getUrl = "GET " + url;
    const res = await context.octokit.request(getUrl, {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const files = res.data;

    return files;
  } catch (error) {
    console.error(error);
  }
}

async function createComment(context, body) {
  try {
    const { owner, repo, issue_number } = context.issue();

    const res = await context.octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: owner,
        repo: repo,
        issue_number,
        body,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    return res;
  } catch (error) {
    console.error(error);
  }
}

async function getPrCommitsMessages(context) {
  try {
    const { owner, repo, pull_number } = context.pullRequest();

    console.log({ pr: context.pullRequest() });

    const res = await context.octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits",
      {
        owner: owner,
        repo: repo,
        pull_number: pull_number,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const commitsMessages = res.data.map(({ commit: { message } }) => message);

    return commitsMessages;
  } catch (error) {
    console.error(error);
  }
}

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
    console.log({ context: context.payload.issue.pull_request });

    // try some other way too

    const pullUrl =
      context?.payload?.issue?.pull_request?.url.split(
        "https://api.github.com"
      )[1] + "/files";

    const { owner, repo, issue_number: number } = context.issue();
    // const { pull_number } = context.pullRequest();

    const comments = await getAllIssueComments(context);

    console.log({ comments });

    const files = await getPrFiles(pullUrl, context);

    // Iterate through the files and access the diff content
    for (const file of files) {
      if (file.filename.includes(".js")) {
        console.log({ code: file.patch.split("@@")[2] });
      }

      // file name should be .js

      console.log(`File: ${file.filename}`);
      // console.log(`Diff Content:\n${file.patch}`);
    }

    if (comments.slice(-1).includes("/execute")) {
      // console.log(comments.slice(-1), [].slice(-1));
      const res = createComment(context, "new body");
    }

    // getPistonResponse();
  });

  app.on("pull_request.opened", async (context) => {
    const { owner, repo, issue_number: number } = context.issue();
    const { pull_number } = context.pullRequest();

    const commitsMessages = await getPrCommitsMessages(context);

    const pullUrl = `/repos/${owner}/${repo}/pulls/${number}/files`;

    const files = await getPrFiles(pullUrl, context);

    function getFinalCode(lines) {
      const ridRemovedCode = lines.filter(
        (line) => !(line.trim().startsWith("-") || line.trim() === "")
      );

      const removePlusSign = ridRemovedCode.map((line) =>
        line.trim().startsWith("+") ? line.replace("+", "") : line
      );

      const finalCode = removePlusSign.join("");

      return finalCode;
    }

    for (const file of files) {
      if (file.filename.includes(".js")) {
        // console.log(file.patch.split("@@")[2].split("\n"));
        // console.log(getFinalCode(file.patch.split("@@")[2].split("\n")));
        const code = getFinalCode(file.patch.split("@@")[2].split("\n"));
        const result = await getPistonResponse(code);

        // if else for error
        console.log({ output: result?.run.stdout });

        createComment(context, result?.run?.stdout);
      }
      // console.log(`File: ${file.filename}`);
      // console.log(`Diff Content:\n${file.patch}`);
    }

    // filename not js we will tell that in the comment
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};

async function getPistonResponse(code) {
  const { piston } = await import("piston-client");
  // console.log({ response: response.piston });
  const client = piston();
  const result = await client.execute("javascript", code, {
    language: "3.9.4 ",
  });
  return result;
}

// app.on("pull_request.opened", async (context) => {
//   // Access the pull request object from the event payload
//   const pullRequest = context.payload.pull_request;

//   // Access the diff (code changes) of the pull request
//   const codeChanges = pullRequest.body;

//   // You can now work with the code changes as needed
//   console.log(codeChanges);
// });

// app.onAny(async (context) => {
//   console.log({ action: context });
// });

// app.auth("pull_request.create", async (context) => {
//   const { owner, repo, issue_number: number } = context.issue();
//   const { pull_number } = context.pullRequest();

//   const comments = await context.octokit.request(
//     "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
//     {
//       owner: owner,
//       repo: repo,
//       issue_number: issue_number,
//       headers: {
//         "X-GitHub-Api-Version": "2022-11-28",
//       },
//     }
//   );

//   console.log({ comments });
// });

// try {
//   // Make a custom API request to fetch the diff content
//   const response = await context.octokit.request(
//     "GET /repos/:owner/:repo/pulls/:number/files",
//     {
//       owner,
//       repo,
//       number,
//     }
//   );
//   // console.log(response);
//   // Access the diff content from the response
//   const files = response.data;

//   // Iterate through the files and access the diff content
//   for (const file of files) {
//     console.log(`File: ${file.filename}`);
//     console.log(`Diff Content:\n${file.patch}`);
//   }
// } catch (error) {
//   console.error("Error fetching PR diff:", error);
// }

// (async () => {
//   const client = piston({ server: "https://emkc.org" });

//   const runtimes = await client.runtimes();
//   // [{ language: 'python', version: '3.9.4', aliases: ['py'] }, ...]

//   const result = await client.execute("python", 'print("Hello World!")');
//   console.log({ result });
//   // { language: 'python', version: '3.9.4', run: {
//   //     stdout: 'Hello World!\n',
//   //     stderr: '',
//   //     code: 0,
//   //     signal: null,
//   //     output: 'Hello World!\n'
//   // }}
// })();
