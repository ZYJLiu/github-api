import { VStack, Code, Link } from "@chakra-ui/react"
import { octokit } from "@/utils/octokit"
import { useEffect, useState } from "react"
import axios from "axios"

interface Props {
  item: any
}

const Data: React.FC<Props> = ({ item }) => {
  const [data, setData] = useState(null)
  const [markdown, setMarkdown] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await octokit.request(
        "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
        {
          owner: "solana-foundation",
          repo: "solana-improvement-documents",
          pull_number: item.number,
        }
      )
      setData(res.data[0])
    }
    fetchData()
  }, [item])

  const reformatURL = (url) => {
    let newURL = url.replace("github.com", "raw.githubusercontent.com")
    newURL = newURL.replace("/raw/", "/")
    newURL = newURL.replace("%2F", "/")
    return newURL
  }

  useEffect(() => {
    const fetchData = async (newURL) => {
      const res = await axios.get(newURL)
      const data = JSON.stringify(res.data, null, 2)
      setMarkdown(res.data)
      console.log(res.data)
    }

    if (data) {
      const convertedURL = reformatURL(data.raw_url)
      fetchData(convertedURL)
    }
  }, [data])

  return (
    <VStack>
      <Link
        href={item.html_url}
        isExternal
        color="blue.500"
        _hover={{
          color: "blue.600",
        }}
      >
        Link
      </Link>
      {markdown && (
        <Code whiteSpace="pre" fontFamily="mono" width="50vw" key={item.id}>
          {markdown}
        </Code>
      )}
      {data && (
        <Code whiteSpace="pre" fontFamily="mono" width="50vw" key={item.id}>
          {JSON.stringify(data, null, 2)}
        </Code>
      )}
    </VStack>
  )
}

export default Data
