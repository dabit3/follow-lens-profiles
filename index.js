import { ethers } from 'ethers'
import ABI from './ABI.json' assert { type: "json" }
import getTwitterReplies  from './getTwitterReplies.js'
// const handles = ["stani.lens", "paris.lens", "nader.lens", "camiinthisthang.lens"]

const ENDPOINT = process.env.infuraEndpoint
const CONTRACT_ADDRESS = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"

async function main(token) {
  const provider = new ethers.providers.JsonRpcProvider(ENDPOINT)
  const signer = await getSigner(provider)
  await followProfiles(provider, signer, token)
}

async function followProfiles(provider, signer, token) {
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    signer
  )
  try {
    const { handles, next_token } = await getTwitterReplies(token)

    let addresses = await Promise.all(handles.map(async handle => {
      let address = await contract.getProfileIdByHandle(handle)
      let followModule = await contract.getFollowModule(address)
      let canFollow = /^0x0+$/.test(followModule)
      if (canFollow) {
        return address.toHexString()
      }
      return address.toHexString()
    }))
    addresses = addresses.filter(address => address)
    addresses = addresses.filter(address => address !== "0x00")

    const feeData = await provider.getFeeData()
    const datas = addresses.map(() => 0x0)

    const tx = await contract.follow(addresses, datas, {
      gasLimit: 10000000,
      gasPrice: feeData.gasPrice
    })
    console.log('followed all...', tx)
    if (next_token) {
      main(next_token)
    }
    /* if you have issues with certain profiles, consider running them one at a time */
    // await Promise.all(handles.map(async handle => {
    //   const feeData = await provider.getFeeData()
    //   let address = await contract.getProfileIdByHandle(handle)
    //   address = address.toHexString()
    //   let followModule = await contract.getFollowModule(address)
    //   let canFollow = /^0x0+$/.test(followModule)
    //   if (canFollow) {
    //     await contract.follow([address], [0x0], { gasPrice: feeData.gasPrice })
    //     console.log('followed...')
    //   }
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