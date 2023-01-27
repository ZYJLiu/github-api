import { Link as ChakraLink, Tr, Td } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { fetchGitHubRawFileData, parseMetadata } from "@/utils/utils"
import Link from "next/link"

interface Props {
  item: any
}

const DataProposal: React.FC<Props> = ({ item }) => {
  const [markdown, setMarkdown] = useState(null)
  const [metadata, setMetadata] = useState(null)

  useEffect(() => {
    const fetchData = async (url) => {
      // console.log(url)
      const data = await fetchGitHubRawFileData(url)
      try {
        const metadata = parseMetadata(data)
        setMetadata(metadata)

        console.log(JSON.stringify(metadata, null, 2))
      } catch (e) {
        console.log("fail parse", item.number)
      }
      setMarkdown(data)
    }

    if (item) {
      fetchData(item.download_url)
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
        {/* <Link href={`/simd/${item.number}`}> Page</Link> */}
        <Link href={`/simd/${item.number ? item.number : item.title}`}>
          {" "}
          Page
        </Link>
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
