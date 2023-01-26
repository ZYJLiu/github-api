import { VStack, Text } from "@chakra-ui/react"
import { useEffect } from "react"
// import { octokit } from "../utils/octokit"
import Data from "../components/Data"
import { fetchGitHubPullRequests } from "../utils/octokit"

export async function getStaticProps() {
  const data = await fetchGitHubPullRequests()
  return { props: { data } }
}

export default function Home({ data }) {
  // console.log(data)
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const limit = await octokit.request("GET /rate_limit", {})
  //     console.log(JSON.stringify(limit.data, null, 2))
  //   }
  //   fetchData()
  // }, [])

  return (
    <VStack justifyContent="center">
      <Text as="b">Test</Text>
      {data && (
        <VStack>
          {data.map((item) => (
            <VStack width="75vw" alignItems="left">
              <Data item={item} />
            </VStack>
          ))}
        </VStack>
      )}
    </VStack>
  )
}
