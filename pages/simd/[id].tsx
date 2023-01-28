import { Code, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { fetchGitHubRawFileData, fetchData } from "../../utils/utils"

export async function getStaticPaths() {
  const items = await fetchData()
  const paths = items.map(({ id }) => ({
    params: { id: id.toString() },
  }))

  return { paths, fallback: false, revalidate: 300 }
}

export async function getStaticProps({ params }) {
  const items = await fetchData()
  const itemIndex = items.findIndex((item) => item.id.toString() === params.id)
  if (itemIndex === -1) return { props: {} }
  return { props: { item: items[itemIndex], items }, revalidate: 300 }
}

const SIMD: React.FC<{ item: any }> = ({ item }) => {
  const [markdown, setMarkdown] = useState(null)

  useEffect(() => {
    if (!item) return
    const fetchData = async () => {
      // Use map instead of forEach to get an array of promises
      const dataPromises = item.download_url.map(async (url) => {
        return await fetchGitHubRawFileData(url)
      })
      const dataArray = await Promise.all(dataPromises)
      const markdownData = dataArray.join("")
      setMarkdown(markdownData)
    }
    fetchData()
  }, [item.download_url])

  return (
    <VStack alignItems="center" justifyContent="center">
      {markdown && (
        <Code whiteSpace="pre" fontFamily="mono" width="50vw" key={item}>
          {markdown}
        </Code>
      )}
    </VStack>
  )
}
export default SIMD
