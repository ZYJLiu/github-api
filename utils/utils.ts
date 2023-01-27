export const fetchRepo = async () => {
  const response = await fetch(
    `https://api.github.com/repos/solana-foundation/solana-improvement-documents/contents/proposals`,
    {
      headers: {
        authorization: `TOKEN ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    }
  )
  const json = await response.json()
  return (
    json
      // @ts-ignore
      .filter((item) => item.type === "file")
      // @ts-ignore
      .map(({ name, download_url, html_url }) => ({
        name, // file name
        download_url, // raw url
        html_url, // github url
      }))
  )
}
// fetch all pull requests
export const fetchGitHubPullRequests = async () => {
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
      html_url, // github url
      number, // pull request number
      title, // pull request title
      userHtmlUrl, // user github url
    })
  )
  const requestPromises = pullRequests.map(({ number }) =>
    fetchGitHubPullRequestFiles(number)
  )
  const download_url = await Promise.all(requestPromises)
  pullRequests.forEach((pullRequest, index) => {
    pullRequest.download_url = download_url[index]
  })
  return pullRequests
}

export const fetchGitHubPullRequestFiles = async (input) => {
  return await fetch(
    `https://api.github.com/repos/solana-foundation/solana-improvement-documents/pulls/${input}/files`,
    {
      headers: {
        authorization: `TOKEN ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.map(({ raw_url }) => reformatURL(raw_url)))
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

// parse md file header
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

export async function fetchData() {
  const [pullRequests, repo] = await Promise.all([
    fetchGitHubPullRequests(),
    fetchRepo(),
  ])

  const items = await Promise.all(
    [...pullRequests, ...repo].map(async (item) => {
      if (!Array.isArray(item.download_url)) {
        item.download_url = [item.download_url]
      }
      const dataArray = await Promise.all(
        item.download_url.map(async (url) => {
          return await fetchGitHubRawFileData(url)
        })
      )
      try {
        item.metadata = JSON.parse(
          JSON.stringify(parseMetadata(dataArray.join("")))
        )
      } catch (e) {
        console.log("Failed to parse metadata")
      }
      return item
    })
  )
  return { items }
}
