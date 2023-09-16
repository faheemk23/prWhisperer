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

async function getPistonResponse(code) {
  const { piston } = await import("piston-client");
  const client = piston();
  const result = await client.execute("javascript", code, {
    language: "3.9.4 ",
  });
  return result;
}

module.exports = {
  getAllIssueComments,
  getPrFiles,
  createComment,
  getPrCommitsMessages,
  getFinalCode,
  getPistonResponse,
};
