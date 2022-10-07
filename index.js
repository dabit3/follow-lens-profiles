import { ethers } from 'ethers'
import ABI from './ABI.json' assert { type: "json" }

const addresses = ["stani.lens", "paris.lens", "nader.lens"]

const ENDPOINT = process.env.infuraEndpoint
const CONTRACT_ADDRESS = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"

async function main() {
  const provider = new ethers.providers.JsonRpcBatchProvider(ENDPOINT)
  const signer = await getSigner(provider)
  await followProfiles(provider, signer)
}

async function followProfiles(provider, signer) {
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    signer
  )
  try {
    await Promise.all(addresses.map(async address => {
      const feeData = await provider.getFeeData()
      let handle = await contract.getProfileIdByHandle(address)
      handle = handle.toHexString()
      await contract.follow([handle], [0x0], { gasPrice: feeData.gasPrice })
      console.log('followed...')
    }))
  } catch (err) {
    console.log('error: ', err)
  }
}

async function getSigner(provider) {
  const signer = new ethers.Wallet(process.env.pk3, provider);
  return signer
}

main()