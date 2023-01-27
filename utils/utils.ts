// fetch files in the proposals folder
export const fetchModules = async () => {
  //@ts-ignore
  const modules = []
  await fetch(
    `https://api.github.com/repos/solana-foundation/solana-improvement-documents/contents/proposals`,
    {
      headers: {
        authorization: `TOKEN ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    }
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response)
      const files = []
      for (let item of response) {
        if (item.type === "file") {
          files.push({
            title: item.name,
            path: item.path,
            download_url: item.download_url,
            html_url: item.html_url,
          })
        }
      }
      modules.push({
        files: files,
      })
    })
  //@ts-ignore
  return modules
}

// fetch all pull requests
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
