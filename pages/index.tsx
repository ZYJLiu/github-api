import { VStack, Text, Code } from "@chakra-ui/react"
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
      {/* {markdown && (
        <Code whiteSpace="pre" fontFamily="mono" width="50vw">
          {markdown}
        </Code>
      )} */}
      <VStack alignItems="left">
        {data && (
          <VStack alignItems="left">
            {data.map((item: any) => (
              <Data item={item} />
            ))}
          </VStack>
        )}
        {proposalData && (
          <VStack alignItems="left">
            {proposalData[0].files.map((item: any) => (
              <DataProposal item={item} />
            ))}
          </VStack>
        )}
      </VStack>
    </VStack>
  )
}
