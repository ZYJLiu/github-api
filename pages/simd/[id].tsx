import Page from "@/components/Page"
import {
  fetchGitHubPullRequestFileData,
  fetchGitHubPullRequestFiles,
} from "@/utils/octokit"
import { Code, Text, VStack } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function SIMD() {
  const router = useRouter()

  const { id } = router.query as { id: string }

  return (
    <VStack alignItems="center" justifyContent="center">
      <Page item={id} />
    </VStack>
  )
}
