import { ethers } from 'ethers'
import ABI from './ABI.json' assert { type: "json" }

const handles = ["stani.lens", "paris.lens", "nader.lens", "camiinthisthang.lens"]

const ENDPOINT = process.env.infuraEndpoint
const CONTRACT_ADDRESS = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(ENDPOINT)
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
    const addresses = await Promise.all(handles.map(async handle => {
      let address = await contract.getProfileIdByHandle(handle)
      return address.toHexString()
    }))
    const feeData = await provider.getFeeData()
    console.log('addresses: ', addresses)
    await contract.follow(addresses, [0x0], { gasPrice: feeData.gasPrice })
    console.log('followed all...')
    /* if you have issues with certain profiles, consider running them one at a time */
    // await Promise.all(handles.map(async handle => {
    //   const feeData = await provider.getFeeData()
    //   let address = await contract.getProfileIdByHandle(handle)
    //   address = address.toHexString()
    //   await contract.follow([address], [0x0], { gasPrice: feeData.gasPrice })
    //   console.log('followed...')
    // }))
  } catch (err) {
    console.log('error: ', err)
  }
}

async function getSigner(provider) {
  const signer = new ethers.Wallet(process.env.pk3, provider);
  return signer
}

main()