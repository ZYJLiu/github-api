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
import { fetchData } from "@/utils/utils"
import TableRow from "@/components/TableRow"
import { useEffect } from "react"

export async function getStaticProps() {
  // const items = await fetchData()
  const items = []
  return { props: { items }, revalidate: 300 }
}

export default function SIMD({ items }) {
  useEffect(() => {
    if (!items) return
    const fetchData = async () => {
      const res = await fetch(`https://api.github.com/rate_limit`, {
        headers: {
          authorization: `TOKEN ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        },
      })
      const limit = await res.json()
      console.log(JSON.stringify(limit, null, 2))
    }
    fetchData()
  }, [])

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
              <Th>Github</Th>
              <Th>Temp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item, index) => (
              <TableRow key={index} item={item} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  )
}

// useEffect(() => {
//   const fetchData = async () => {
//     const res = await fetch(`https://api.github.com/rate_limit`, {
//       headers: {
//         authorization: `TOKEN ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
//       },
//     })
//     const limit = await res.json()
//     console.log(JSON.stringify(limit, null, 2))
//   }
//   fetchData()
// }, [])

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
