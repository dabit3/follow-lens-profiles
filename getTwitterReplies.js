import axios from 'axios'
const conversationId = "1577148516849549312"

async function getTwitterReplies(next_token) {
  try {
    const response = await axios.get( 
      `https://api.twitter.com/2/tweets/search/recent?tweet.fields=author_id&query=conversation_id:${conversationId}`,
      {
        headers: { Authorization: `Bearer ${process.env.TW_BEARER}` },
        params: {
          max_results: 10,
          next_token
        }
      }
    )

    const lensInfo = response.data.data.map(d => d.text)

    let profiles = lensInfo.map(p => p.trim().split(/\s+/))
    profiles = profiles.flatMap(p => p)
    profiles = profiles.filter(p => p.includes('.lens') && p.length > 5)
    profiles = profiles.filter(p => !p.startsWith('.lens', 0))
    profiles = profiles.map(profile => profile.replace('@', '').toLowerCase())

    const uniqueprofiles = [...new Set(profiles)];

    return {
      handles: uniqueprofiles, next_token: response.data.meta.next_token
    }
  } catch (err) {
    console.log("error", err)
  }
}

export default getTwitterReplies