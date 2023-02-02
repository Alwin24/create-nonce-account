import {
	clusterApiUrl,
	Connection,
	Keypair,
	Transaction,
	NONCE_ACCOUNT_LENGTH,
	SystemProgram,
	LAMPORTS_PER_SOL,
	PublicKey,
} from '@solana/web3.js'
import { writeFileSync, writeFile, readFileSync } from 'fs'

// Setup our connection and wallet
const connection = new Connection(clusterApiUrl('mainnet-beta'), 'processed')
const devWalletUint = Uint8Array.from(JSON.parse(readFileSync('/home/alwin/.config/solana/id.json')))
const devWalletUint2 = Uint8Array.from(JSON.parse(readFileSync('/home/alwin/lunar-keypair/id.json')))

const authority = Keypair.fromSecretKey(devWalletUint)
const authority2 = Keypair.fromSecretKey(devWalletUint2)

let nonceAccounts = JSON.parse(readFileSync('oldNonceAccs.json')).accounts.map((acc) => new PublicKey(acc))
let transactions = []

let txn = new Transaction()
for (let i = 50; i < 55; ) {
	txn.add(
		SystemProgram.nonceAuthorize({
			noncePubkey: nonceAccounts[i],
			authorizedPubkey: authority.publicKey,
			newAuthorizedPubkey: authority2.publicKey,
		})
	)
	++i
	if (i % 5 == 0) {
		transactions.push(txn)
		txn = new Transaction()
	}
}

let result = await Promise.all(transactions.map((tx) => connection.sendTransaction(tx, [authority])))
console.log(result)
