import { getTxs, removePendingTx, clearOldTxs } from "@/helpers/txStorage"
import { usePublicClient } from "wagmi"
import { useEffect } from "react"
import toast from "react-hot-toast"

export function usePendingTxWatcher() {
  const publicClient = usePublicClient()

  useEffect(() => {
    if (!publicClient) return

    async function checkTxs() {
      clearOldTxs()

      const txs = getTxs()
      if (!txs.length) return

      for (const tx of txs) {
        try {
          const receipt = await publicClient.getTransactionReceipt({
            hash: tx.hash as `0x${string}`,
          })

          if (receipt?.status === "success") {
            removePendingTx(tx.hash)

            toast(
              "A pending transaction was confirmed on the blockchain",
              { icon: "ℹ️" }
            )
          }
        } catch {
          // tx not found
        }
      }
    }

    checkTxs()
  }, [publicClient])
}
