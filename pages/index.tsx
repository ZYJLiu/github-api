import {
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react"
// import { octokit } from "../utils/octokit"
import {
  fetchRepo,
  fetchGitHubPullRequests,
  fetchGitHubRawFileData,
  parseMetadata,
} from "@/utils/utils"
import TableRow from "@/components/TableRow"

export async function getStaticProps() {
  const [dataPr, dataRepo] = await Promise.all([
    fetchGitHubPullRequests(),
    fetchRepo(),
  ])
  const items = [...dataRepo, ...dataPr]

  // Use the `map` method to fetch and parse the metadata for each item
  const metadataPromises = items.map(async (item) => {
    if (!Array.isArray(item.download_url)) {
      item.download_url = [item.download_url]
    }
    const dataPromises = item.download_url.map(async (url) => {
      return await fetchGitHubRawFileData(url)
    })
    const dataArray = await Promise.all(dataPromises)
    try {
      return JSON.parse(JSON.stringify(parseMetadata(dataArray.join(""))))
    } catch (e) {
      console.log("fail parse")
    }
  })

  // Wait for all the metadata to be fetched and parsed
  const metadata = await Promise.all(metadataPromises)

  return { props: { items, metadata }, revalidate: 1 }
}

export default function Home({ items, metadata }) {
  console.log(metadata)
  return (
    <VStack>
      <TableContainer>
        <Table>
          <TableCaption fontWeight="bold" placement="top">
            SIMD Information
          </TableCaption>
          <Thead>
            <Tr>
              <Th>SIMD</Th>
              <Th>Title</Th>
              <Th>Status</Th>
              <Th>Type</Th>
              <Th>Authors</Th>
              <Th>Created</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item, index) => (
              <TableRow key={index} item={item} metadata={metadata[index]} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  )
}

// async function test() {
//   const test = await fetchRepo()
//   const test2 = await fetchGitHubPullRequests()
//   console.log(test)
//   console.log(test2)
// }
// test()
// const [markdown, setMarkdown] = useState(null)
// // console.log(data)
// useEffect(() => {
//   const fetchData = async () => {
//     const test = await fetchModules()
//     console.log(test[0].files[0].download_url)
//     console.log(test[0].files[1].download_url)
//     const file = await fetchGitHubRawFileData(test[0].files[0].download_url)
//     setMarkdown(file)
//     // const limit = await octokit.request("GET /rate_limit", {})
//     // console.log(JSON.stringify(limit.data, null, 2))
//   }
//   fetchData()
// }, [])
