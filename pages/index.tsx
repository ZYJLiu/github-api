import {
  VStack,
  Text,
  Code,
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
// import { octokit } from "../utils/octokit"
import Data from "@/components/Data"
import {
  fetchGitHubPullRequests,
  fetchModules,
  fetchGitHubFile,
  fetchGitHubRawFileData,
} from "@/utils/utils"
import DataProposal from "@/components/DataProposal"

export async function getStaticProps() {
  const data = await fetchGitHubPullRequests()
  const proposalData = await fetchModules()
  console.log(proposalData)
  return { props: { data, proposalData }, revalidate: 1 }
}

export default function Home({
  data,
  proposalData,
}: {
  data: any
  proposalData: any
}) {
  console.log(proposalData)
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

  return (
    <VStack>
      <Text as="b">Test</Text>
      <TableContainer>
        <Table>
          <TableCaption>SIMD Information</TableCaption>
          <Thead>
            <Tr>
              <Th>Github</Th>
              <Th>Page</Th>
              <Th>SIMD</Th>
              <Th>Title</Th>
              <Th>Status</Th>
              <Th>Type</Th>
              <Th>Authors</Th>
              <Th>Created</Th>
            </Tr>
          </Thead>
          {data && (
            <Tbody>
              {data.map((item: any) => (
                <Data item={item} />
              ))}
            </Tbody>
          )}
          {proposalData && (
            <Tbody>
              {proposalData[0].files.map((item: any) => (
                <DataProposal item={item} />
              ))}
            </Tbody>
          )}
        </Table>
      </TableContainer>
    </VStack>
  )
}

{
  /* {markdown && (
        <Code whiteSpace="pre" fontFamily="mono" width="50vw">
          {markdown}
        </Code>
      )} */
}
