import {
  Code,
  VStack,
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
  Link as ChakraLink,
  Link,
} from "@chakra-ui/react"
import { useEffect, useState, Fragment } from "react"
import { fetchGitHubRawFileData, fetchData } from "../../utils/utils"

export async function getStaticPaths() {
  const items = await fetchData()
  const paths = items.map(({ id }) => ({
    params: { id: id.toString() },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const items = await fetchData()
  const item = items.find((item) => item.id.toString() === params.id)
  if (!item) return { props: {} }
  return { props: { item, items }, revalidate: 300 }
}

const SIMD: React.FC<{ item: any }> = ({ item }) => {
  console.log(item)

  const [markdownData, setMarkdownData] = useState({
    filtered: null,
    sections: null,
  })
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!item) return
    const fetchData = async () => {
      const dataPromises = item.download_url.map(async (url) => {
        return await fetchGitHubRawFileData(url)
      })
      const dataArray = await Promise.all(dataPromises)
      const markdown = dataArray.join("")
      setData(markdown)

      // Use regular expression to match the YAML front matter
      const filtered = markdown.replace(/^---[\s\S]*?---/m, "")

      // parseLinesStartingWithHashtag
      const sections = (markdown.match(/^## .*$/gm) || []).map((line) =>
        line.slice(3)
      )

      setMarkdownData({ filtered, sections })
    }
    fetchData()
  }, [item.download_url])

  return (
    <VStack alignItems="center" justifyContent="center">
      <TableContainer>
        <Table>
          <TableCaption fontWeight="bold" placement="top">
            Details
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Key</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>SIMD</Td>
              <Td>{item.metadata.simd}</Td>
            </Tr>
            <Tr>
              <Td>Title</Td>
              <Td>{item.metadata.title}</Td>
            </Tr>
            <Tr>
              <Td>Authors</Td>
              <Td>
                {item.metadata.authors
                  ? item.metadata.authors.map((author, index) => (
                      <div key={index}>
                        {author.name} {author.org && `(${author.org})`}
                      </div>
                    ))
                  : "-"}
              </Td>
            </Tr>
            <Tr>
              <Td>Type</Td>
              <Td>{item.metadata.type}</Td>
            </Tr>
            <Tr>
              <Td>Status</Td>
              <Td>{item.metadata.status}</Td>
            </Tr>
            <Tr>
              <Td>Created</Td>
              <Td>{item.metadata.created}</Td>
            </Tr>
            <Tr>
              <Td>Github Link</Td>
              <Td>
                <ChakraLink
                  href={item.html_url}
                  isExternal
                  color="blue.500"
                  _hover={{
                    color: "blue.600",
                  }}
                >
                  Github Icon
                </ChakraLink>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <TableContainer>
        <Table>
          <TableCaption fontWeight="bold" placement="top">
            Content
          </TableCaption>
          <Tbody>
            {markdownData.sections &&
              markdownData.sections.map((line, index) => (
                <Tr key={index}>
                  <Td>
                    <a href={`#${line}`}>{line}</a>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>

      {markdownData.filtered && (
        <Code whiteSpace="pre" fontFamily="mono" width="50vw">
          {markdownData.filtered.split("\n").map((line, index) => {
            switch (true) {
              case line.startsWith("## "):
                return (
                  <Text key={index}>
                    <a name={line.slice(3)} />
                    {line}
                  </Text>
                )
              default:
                return <Text key={index}>{line}</Text>
            }
          })}
        </Code>
      )}
      <Text>Original Data</Text>
      {data && (
        <Code whiteSpace="pre" fontFamily="mono" width="50vw" key={item}>
          {data}
        </Code>
      )}
    </VStack>
  )
}
export default SIMD
