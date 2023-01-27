import { Link as ChakraLink, Tr, Td } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { fetchGitHubRawFileData, parseMetadata } from "@/utils/utils"
import Link from "next/link"

interface Props {
  item: any
  metadata: any
}

const TableRow: React.FC<Props> = ({ item, metadata }) => {
  if (!metadata) return null

  return (
    <Tr>
      <Td>{metadata.simd}</Td>
      {/* <Td>{metadata.title}</Td> */}
      <Td>
        <Link href={`/simd/${item.number ? item.number : item.name}`}>
          {metadata.title}
        </Link>
      </Td>
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
        <Link href={`/simd/${item.number ? item.number : item.name}`}>
          Page
        </Link>
      </Td>
    </Tr>
  )
}

export default TableRow

// useEffect(() => {
//   //@ts-ignore
//   const fetchData = async (urls) => {
//     if (!Array.isArray(urls)) {
//       urls = [urls]
//     }
//     const dataPromises = urls.map(async (url) => {
//       return await fetchGitHubRawFileData(url)
//     })
//     const dataArray = await Promise.all(dataPromises)
//     try {
//       const metadata = parseMetadata(dataArray.join(""))
//       setMetadata(metadata)
//       console.log(JSON.stringify(metadata, null, 2))
//     } catch (e) {
//       console.log("fail parse", item.number)
//     }
//   }
//   if (item) {
//     fetchData(item.download_url)
//   }
// }, [item])
// if (!metadata) return null
