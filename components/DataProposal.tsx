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
        <Link href={`/simd/${item.title}`}> Page</Link>
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

export default DataProposal

{
  /* {data && (
        <Code whiteSpace="pre" fontFamily="mono" width="50vw" key={item.id}>
          {JSON.stringify(data, null, 2)}
        </Code>
      )} */
}
{
  /* {markdown && (
        <Code whiteSpace="pre" fontFamily="mono" width="50vw" key={item.id}>
          {markdown}
        </Code>
      )} */
}
