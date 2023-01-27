import {
  VStack,
  Code,
  Link as ChakraLink,
  HStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
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
    <Tr>
      <Td>
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
      </Td>
      <Td>
        <Link href={`/simd/${item.number}`}> Page {item.number}</Link>
      </Td>
      {metadata && (
        <>
          <Td>{metadata.simd}</Td>
          <Td>{metadata.title}</Td>
          <Td>{metadata.status}</Td>
          <Td>{metadata.type}</Td>
          <Td>
            {metadata.authors &&
              metadata.authors.map((author, index) => (
                <div key={index}>
                  {author.name} {author.org && `(${author.org})`}
                </div>
              ))}
          </Td>
          <Td>{metadata.created}</Td>
        </>
      )}
    </Tr>
  )
}

export default Data
