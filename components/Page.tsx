import { Code, HStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import {
  fetchGitHubPullRequestFiles,
  fetchGitHubRawFileData,
  reformatURL,
  parseMetadata,
} from "../utils/utils"

interface Props {
  item: any
}

const Page: React.FC<Props> = ({ item }) => {
  const [data, setData] = useState(null)
  const [markdown, setMarkdown] = useState(null)

  useEffect(() => {
    if (!item) return
    const fetchData = async () => {
      const res = await fetchGitHubPullRequestFiles(item)
      // console.log(res)
      setData(res)
    }
    fetchData()
  }, [item])

  useEffect(() => {
    const fetchData = async (url: any) => {
      const data = await fetchGitHubRawFileData(reformatURL(url))
      //@ts-ignore
      setMarkdown(data)
    }

    if (data) {
      //@ts-ignore
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
