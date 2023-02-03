import {
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableCaption,
  TableContainer,
  Text,
  Code,
} from "@chakra-ui/react"
// import { octokit } from "../utils/octokit"
import { fetchData } from "@/utils/utils"
import TableRow from "@/components/TableRow"
import { useEffect, useState } from "react"

// export async function getStaticProps() {
//   // const items = await fetchData()
//   const items = []
//   return { props: { items }, revalidate: 300 }
// }

export default function Home() {
  const [data, setData] = useState(null)

  function parseData(data) {
    const lines = data.split("\n")
    let modules = []
    let currentModule = {}
    let currentModuleLessons = []

    for (const line of lines) {
      if (line === "") {
        if (currentModule.name) {
          currentModule.lessons = currentModuleLessons
          modules.push(currentModule)
          currentModuleLessons = []
          currentModule = {}
        }
      } else if (line.startsWith("### Module")) {
        if (currentModule.name) {
          currentModule.lessons = currentModuleLessons
          modules.push(currentModule)
          currentModuleLessons = []
        }
        const moduleNumber = parseInt(
          line
            .substring(line.indexOf("Module") + 7)
            .trim()
            .split(" ")[0]
        )
        currentModule = {
          number: moduleNumber,
          name: line
            .substring(line.indexOf("Module") + 7)
            .trim()
            .replace(/^\d+\s*-\s*/, ""),
        }
      } else if (line.match(/^\s*\d+\.\s+\[.*\]\(.*\)/)) {
        const title = line.substring(line.indexOf("[") + 1, line.indexOf("]"))
        const link =
          "https://raw.githubusercontent.com/Unboxed-Software/solana-course/main" +
          line.substring(line.indexOf("(") + 2, line.indexOf(")"))
        currentModuleLessons.push({ title, link })
      }
    }
    if (currentModule.name) {
      currentModule.lessons = currentModuleLessons
      modules.push(currentModule)
    }
    return modules
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `https://raw.githubusercontent.com/Unboxed-Software/solana-course/main/README.md`
      )
      console.log(res)
      const text = await res.text()
      // console.log(JSON.stringify(json, null, 2))

      const modules = parseData(text)
      const json = JSON.stringify(modules, null, 2)
      console.log(json)
      setData(json)
    }
    fetchData()
  }, [])

  return (
    <VStack>
      <Text>Test</Text>
      {data && (
        <Code whiteSpace="pre" fontFamily="mono" width="50vw">
          {data}
        </Code>
      )}
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
