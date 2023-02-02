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
const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed')
const devWalletUint = Uint8Array.from(JSON.parse(readFileSync('~/lunar-keypair/id.json')))

const authority = Keypair.fromSecretKey(devWalletUint)
const lamports = await connection.getMinimumBalanceForRentExemption(NONCE_ACCOUNT_LENGTH)

let nonceAccounts = []
for (let i = 0; i < 50; ++i) {
	let nonceAccount = Keypair.generate()
	nonceAccounts.push(nonceAccount.publicKey.toBase58())
	console.log(`nonce account${i + 1}: ${nonceAccount.publicKey.toBase58()}`)

	let tx = new Transaction().add(
		// SystemProgram.createAccount({
		// 	fromPubkey: authority.publicKey,
		// 	newAccountPubkey: nonceAccount.publicKey,
		// 	lamports,
		// 	space: NONCE_ACCOUNT_LENGTH,
		// 	programId: SystemProgram.programId,
		// }),

		// SystemProgram.nonceInitialize({
		// 	noncePubkey: nonceAccount.publicKey, // nonce account pubkey
		// 	authorizedPubkey: authority.publicKey, // nonce account authority (for advance and close)
		// }),

        SystemProgram.nonceAuthorize({
            noncePubkey: nonceAccount.publicKey,
            authorizedPubkey,
            newAuthorizedPubkey
        })

		// SystemProgram.nonceWithdraw({
		//     noncePubkey: new PublicKey("EghBE8ooDrrorgpPcowHjZMAyW86PnXnXo9kneKtj24G"),
		//     authorizedPubkey: authority.publicKey,
		//     toPubkey: authority.publicKey,
		//     lamports: await connection.getMinimumBalanceForRentExemption(NONCE_ACCOUNT_LENGTH),
		// })
	)

	// await connection.sendTransaction(tx, [authority, nonceAccount])
	console.log(`txhash: ${await connection.sendTransaction(tx, [authority])}`)
}

// writeFile('result3.txt', 'export const nonceAcc = ["' + nonceAccounts.join('","') + '"]', err => {
//     if (err) {
//         console.error(err);
//     }
//     // file written successfully
// })
