export const fetchGitHubPullRequestFileData = async (url) => {
  const reformatURL = (url) => {
    let newURL = url.replace("github.com", "raw.githubusercontent.com")
    newURL = newURL.replace("/raw/", "/")
    newURL = newURL.replace("%2F", "/")
    return newURL
  }

  return await fetch(reformatURL(url)).then((res) => res.text())
}

export const fetchGitHubPullRequestFiles = async (number) => {
  return await fetch(
    `https://api.github.com/repos/solana-foundation/solana-improvement-documents/pulls/${number}/files`,
    {
      headers: {
        authorization: `TOKEN ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    }
  ).then((res) => res.json())
}

export const fetchGitHubPullRequests = async () => {
  return await fetch(
    `https://api.github.com/repos/solana-foundation/solana-improvement-documents/pulls`,
    {
      headers: {
        authorization: `TOKEN ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    }
  ).then((res) => res.json())
}
