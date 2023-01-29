import { Code, VStack, Text } from "@chakra-ui/react"
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
      <Text>{item.metadata.simd}</Text>
      {markdownData.sections && (
        <>
          <Code whiteSpace="pre" fontFamily="mono" width="50vw" key={item}>
            {markdownData.sections.map((line, index) => (
              <Text key={index}>
                <a href={`#${line}`}>{line}</a>
              </Text>
            ))}
          </Code>
          {markdownData.filtered && (
            <Code whiteSpace="pre" fontFamily="mono" width="50vw" key={item}>
              {markdownData.filtered.split("\n").map((line, index) => {
                if (line.startsWith("## ")) {
                  return (
                    <Fragment key={index}>
                      <a name={line.slice(3)} />
                      {line}
                      <br />
                    </Fragment>
                  )
                }
                return (
                  <Fragment key={index}>
                    {line}
                    <br />
                  </Fragment>
                )
              })}
            </Code>
          )}
        </>
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
