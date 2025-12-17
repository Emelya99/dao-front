export const TX_STORAGE_KEY = "pending_transactions";

export type StoredTx = {
  hash: string;
  chainId: number;
  contract?: string;
  tag?: string; // e.g. "createProposal"
  timestamp: number;
};

// Save a new transaction, if it's not already in the list
export function savePendingTx(tx: StoredTx) {
  const list = getTxs();
  const exists = list.find(t => t.hash === tx.hash);
  if (!exists) {
	list.push(tx);
	localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(list));
  }
}

// Gets the list of saved transactions
export function getTxs(): StoredTx[] {
  try {
	return JSON.parse(localStorage.getItem(TX_STORAGE_KEY) || "[]");
  } catch {
	return [];
  }
}

// Delete a transaction by hash
export function removePendingTx(hash: string) {
  const list = getTxs().filter(t => t.hash !== hash);
  localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(list));
}

// Clear old transactions older than maxAgeMinutes
export function clearOldTxs(maxAgeMinutes = 60) {
  const cutoff = Date.now() - maxAgeMinutes * 60_000;
  const fresh = getTxs().filter(t => t.timestamp > cutoff);
  localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(fresh));
}