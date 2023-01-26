import {
  VStack,
  Code,
  Link as ChakraLink,
  HStack,
  Text,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import {
  fetchGitHubPullRequestFiles,
  fetchGitHubPullRequestFileData,
} from "../utils/octokit"

interface Props {
  item: any
}

const Page: React.FC<Props> = ({ item }) => {
  const [data, setData] = useState(null)
  const [markdown, setMarkdown] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchGitHubPullRequestFiles(item)
      // console.log(res)
      setData(res)
    }
    fetchData()
  }, [item])

  useEffect(() => {
    const fetchData = async (url) => {
      // console.log(url)
      const data = await fetchGitHubPullRequestFileData(url)
      // console.log(md)
      setMarkdown(data)
    }

    if (data) {
      // console.log("raw", data[0].raw_url)
      fetchData(data[0].raw_url)
    }
  }, [data])

  return (
    <HStack alignItems="top">
      {markdown && (
        <Code whiteSpace="pre" fontFamily="mono" width="50vw" key={item}>
          {markdown}
        </Code>
      )}
    </HStack>
  )
}

export default Page
