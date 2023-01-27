import { Code, HStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import {
  fetchGitHubRawFileData,
  fetchGitHubPullRequestFiles,
} from "../utils/utils"

interface Props {
  item: any
}

const Page: React.FC<Props> = ({ item }) => {
  // console.log(item)
  const [markdown, setMarkdown] = useState(null)

  useEffect(() => {
    if (!item) return
    const fetchData = async () => {
      const res = await fetchGitHubPullRequestFiles(item)
      const data = res.filter((el: any) => el !== null)
      const dataPromises = data.map(async (url: any) => {
        // console.log(url)
        return await fetchGitHubRawFileData(url)
      })
      const dataArray = await Promise.all(dataPromises)
      const markdownData = dataArray.join("")
      setMarkdown(markdownData)
    }
    fetchData()
  }, [item])

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
