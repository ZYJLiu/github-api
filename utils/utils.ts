// fetch files in the proposals folder
export const fetchModules = async () => {
  const response = await fetch(
    `https://api.github.com/repos/solana-foundation/solana-improvement-documents/contents/proposals`,
    {
      headers: {
        authorization: `TOKEN ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    }
  )
  const data = await response.json()
  const files = data
    //@ts-ignore
    .filter((item) => item.type === "file")
    //@ts-ignore
    .map((item) => ({
      name: item.name,
      path: item.path,
      download_url: item.download_url,
      html_url: item.html_url,
    }))
  return [{ files }]
}

// fetch all pull requests
export const fetchGitHubPullRequests = async () => {
  //@ts-ignore
  return await fetch(
    `https://api.github.com/repos/solana-foundation/solana-improvement-documents/pulls`,
    {
      headers: {
        authorization: `TOKEN ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    }
  ).then((res) => res.json())
}

// fetch all pull requests
export const fetchGitHubPullRequestsTest = async () => {
  const response = await fetch(
    `https://api.github.com/repos/solana-foundation/solana-improvement-documents/pulls`,
    {
      headers: {
        authorization: `TOKEN ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    }
  )
  const json = await response.json()
  const pullRequests = json.map(
    // @ts-ignore
    ({ html_url, number, title, user: { html_url: userHtmlUrl } }) => ({
      html_url,
      number,
      title,
      userHtmlUrl,
    })
  )
  const requestPromises = pullRequests.map(({ number }) =>
    fetchGitHubPullRequestFilesTest(number)
  )
  const download_url = await Promise.all(requestPromises)
  pullRequests.forEach((pullRequest, index) => {
    pullRequest.download_url = download_url[index]
  })
  return pullRequests
}

export const fetchGitHubPullRequestFilesTest = async (number) => {
  return await fetch(
    `https://api.github.com/repos/solana-foundation/solana-improvement-documents/pulls/${number}/files`,
    {
      headers: {
        authorization: `TOKEN ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.map(({ raw_url }) => reformatURL(raw_url)))
}

// fetch pull request files
//@ts-ignore
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

//@ts-ignore
export const reformatURL = (url) => {
  let newURL = url.replace("github.com", "raw.githubusercontent.com")
  newURL = newURL.replace("/raw/", "/")
  newURL = newURL.replace("%2F", "/")
  return newURL
}

// fetch md files
//@ts-ignore
export const fetchGitHubRawFileData = async (url) => {
  return await fetch(url).then((res) => res.text())
}

//@ts-ignore
export const fetchGitHubFile = async (url) => {
  return await fetch(url, {
    headers: {
      authorization: `TOKEN ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
    },
  }).then((res) => res.text())
}

// parse md files
export const parseMetadata = (data) => {
  const re = /---\n(.*)\n---/gs
  const match = re.exec(data)
  if (!match) {
    return {}
  }
  const metadata = match[1]
  const lines = metadata.split("\n")
  const result = {}
  for (const line of lines) {
    if (line.trim().startsWith("-")) {
      const cleanedLine = line.trim().slice(1).trim()
      const [name, org] = cleanedLine.split("(")
      const orgTrim = org ? org.slice(0, -1).trim() : null
      if (result.authors) {
        result.authors.push({ name: name.trim(), org: orgTrim })
      } else {
        result.authors = [{ name: name.trim(), org: orgTrim }]
      }
    } else {
      const [key, value] = line.split(": ")
      if (key === "simd") {
        result[key] = value.replace(/'/g, "")
      } else {
        result[key] = value
      }
    }
  }
  return result
}
