import { Code, HStack, VStack, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import {
  fetchGitHubRawFileData,
  fetchGitHubPullRequestFiles,
  fetchData,
} from "../../utils/utils"

export async function getStaticPaths() {
  const items = await fetchData()

  const paths = items.map((item) => {
    return {
      params: { id: item.id.toString() },
    }
  })

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const items = await fetchData()
  const item = items.find((item) => item.id.toString() === params.id)
  if (!item) return { props: {} }
  return { props: { item }, revalidate: 1 }
}

const SIMD: React.FC<{ item: any }> = ({ item }) => {
  const router = useRouter()
  const { id } = router.query as { id: string }
  const [markdown, setMarkdown] = useState(null)
  console.log(item)
  return (
    <VStack alignItems="center" justifyContent="center">
      <HStack alignItems="top">
        <Text>{id}</Text>
      </HStack>
    </VStack>
  )
}

export default SIMD
