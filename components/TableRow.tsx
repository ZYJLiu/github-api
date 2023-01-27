import { Link as ChakraLink, Tr, Td } from "@chakra-ui/react"
import Link from "next/link"

interface Props {
  item: any
}

const TableRow: React.FC<Props> = ({ item }) => {
  return (
    <Tr>
      <Td>{item.metadata.simd}</Td>
      <Td>
        <Link href={`/simd/${item.number ? item.number : item.name}`}>
          {item.metadata.title}
        </Link>
      </Td>
      <Td>{item.metadata.status}</Td>
      <Td>{item.metadata.type}</Td>
      <Td>
        {item.metadata.authors &&
          item.metadata.authors.map((author, index) => (
            <div key={index}>
              {author.name} {author.org && `(${author.org})`}
            </div>
          ))}
      </Td>
      <Td>{item.metadata.created}</Td>
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
