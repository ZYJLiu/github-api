import Page from "@/components/Page"
import { VStack } from "@chakra-ui/react"
import { useRouter } from "next/router"

export default function SIMD() {
  const router = useRouter()

  const { id } = router.query as { id: string }

  return (
    <VStack alignItems="center" justifyContent="center">
      <Page item={id} />
    </VStack>
  )
}
