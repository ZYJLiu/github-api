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
  fetchGitHubRawFileData,
  parseMetadata,
  reformatURL,
} from "@/utils/utils"
import { useRouter } from "next/router"
import Link from "next/link"

interface Props {
  item: any
}

const DataProposal: React.FC<Props> = ({ item }) => {
  const [data, setData] = useState(null)
  const [markdown, setMarkdown] = useState(null)
  const [metadata, setMetadata] = useState(null)

  useEffect(() => {
    const fetchData = async (url) => {
      // console.log(url)
      const data = await fetchGitHubRawFileData(url)
      // console.log(data)
      const metadata = parseMetadata(data)
      console.log(metadata)
      setMetadata(metadata)
      // console.log(md)
      setMarkdown(data)
    }

    if (item) {
      fetchData(item.download_url)
      // console.log("raw", data[0].raw_url)
      console.log(item.download_url)
      console.log(item.html_url)
    }
  }, [item])

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
      <Link href={`/simd/${item.title}`}> Page</Link>
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

export default DataProposal
