import { VStack, Code, Link as ChakraLink, HStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import {
  fetchGitHubPullRequestFiles,
  fetchGitHubPullRequestFileData,
} from "../utils/octokit"
import { useRouter } from "next/router"
import Link from "next/link"

interface Props {
  item: any
}

const Data: React.FC<Props> = ({ item }) => {
  const [data, setData] = useState(null)
  const [markdown, setMarkdown] = useState(null)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await fetchGitHubPullRequestFiles(item.number)
  //     // console.log(res)
  //     setData(res)
  //   }
  //   fetchData()
  // }, [item])

  // useEffect(() => {
  //   const fetchData = async (url) => {
  //     // console.log(url)
  //     const data = await fetchGitHubPullRequestFileData(url)
  //     // console.log(md)
  //     setMarkdown(data)
  //   }

  //   if (data) {
  //     // console.log("raw", data[0].raw_url)
  //     fetchData(data[0].raw_url)
  //   }
  // }, [data])

  return (
    <HStack alignItems="top">
      <ChakraLink
        href={item.html_url}
        isExternal
        color="blue.500"
        _hover={{
          color: "blue.600",
        }}
      >
        Link
      </ChakraLink>
      <Link href={`/simd/${item.number}`}>SIMD {item.number}</Link>
      {data && (
        <Code whiteSpace="pre" fontFamily="mono" width="50vw" key={item.id}>
          {JSON.stringify(data, null, 2)}
        </Code>
      )}
      {/* {markdown && (
        <Code whiteSpace="pre" fontFamily="mono" width="50vw" key={item.id}>
          {markdown}
        </Code>
      )} */}
    </HStack>
  )
}

export default Data
