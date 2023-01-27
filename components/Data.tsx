import {
  VStack,
  Code,
  Link as ChakraLink,
  HStack,
  Text,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import {
  fetchGitHubRawFileData,
  fetchGitHubPullRequestFiles,
  parseMetadata,
  reformatURL,
} from "@/utils/utils"
import { useRouter } from "next/router"
import Link from "next/link"

interface Props {
  item: any
}

const Data: React.FC<Props> = ({ item }) => {
  const [data, setData] = useState(null)
  const [markdown, setMarkdown] = useState(null)
  const [metadata, setMetadata] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchGitHubPullRequestFiles(item.number)
      // console.log(res)
      setData(res)
    }
    fetchData()
  }, [item])

  // useEffect(() => {
  //   if (data) {
  //     const rawURL = reformatURL(data[0].raw_url)
  //     console.log(rawURL)
  //   }
  // }, [data])
  useEffect(() => {
    const fetchData = async (url) => {
      // console.log(url)
      const data = await fetchGitHubRawFileData(reformatURL(url))
      try {
        const metadata = parseMetadata(data)
        setMetadata(metadata)
        //  const metadataArray = Object.entries(metadata).map(
        //    ([key, value]) => ({
        //      key,
        //      value,
        //    })
        //  )
        // console.log(metadataArray)
        // const metadataArray = Object.entries(metadata).map(([key, value]) => (
        //   <p key={key}>{`${key}: ${value}`}</p>
        // ))
        // setMetadata(metadata)
        console.log(JSON.stringify(metadata, null, 2))
        // console.log(item.number)
      } catch (e) {
        console.log("fail parse", item.number)
      }
      // const md = await fetchGitHubRawFileData(reformatURL(url))

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
      <ChakraLink
        href={item.html_url}
        isExternal
        color="blue.500"
        _hover={{
          color: "blue.600",
        }}
      >
        Github
      </ChakraLink>
      <Link href={`/simd/${item.number}`}> Page {item.number}</Link>
      {metadata && (
        <VStack alignItems="left">
          <Text> {metadata.title}</Text>
          <Text> {metadata.simd}</Text>
          <Text> {metadata.type}</Text>
          <Text> {metadata.created}</Text>
          <Text>Authors:</Text>
          {metadata.authors &&
            metadata.authors.map((author, index) => (
              <div key={index}>
                <Text>
                  {author.name} ({author.org})
                </Text>
              </div>
            ))}
        </VStack>
      )}
      {/* {data && (
        <Code whiteSpace="pre" fontFamily="mono" width="50vw" key={item.id}>
          {JSON.stringify(data, null, 2)}
        </Code>
      )} */}
      {/* {markdown && (
        <Code whiteSpace="pre" fontFamily="mono" width="50vw" key={item.id}>
          {markdown}
        </Code>
      )} */}
    </HStack>
  )
}

export default Data
