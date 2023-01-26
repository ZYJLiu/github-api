import { VStack, Text } from "@chakra-ui/react"
import { useEffect } from "react"
import { octokit } from "../utils/octokit"
import Data from "../components/Data"

export async function getStaticProps() {
  const res = await octokit.request(
    `GET /repos/{owner}/{repo}/pulls{?state,head,base,sort,direction,per_page,page}`,
    {
      owner: "solana-foundation",
      repo: "solana-improvement-documents",
    }
  )
  console.log(res.data)
  return { props: { data: res.data } }
}

export default function Home({ data }) {
  useEffect(() => {
    const fetchData = async () => {
      const limit = await octokit.request("GET /rate_limit", {})
      console.log(JSON.stringify(limit.data, null, 2))
    }
    fetchData()
  }, [])

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
