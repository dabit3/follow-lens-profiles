## Follow profiles on Lens Protocol from Twitter Replies

> DISCLAIMER - This is highly experimental.

This app reads the responses of a tweet from Twitter and follows everyone there who has listed their Lens profile.

This is a good way to follow all of, or many of, the same people you do on Lens as you also do [on Twitter](https://twitter.com/dabit3/status/1577148516849549312) 💁‍♂️.

### Running the app

1. Get a Twitter API Key

2. Set the Twitter API key as an environment variable

```sh
export TW_BEARER = <your-bearer-token>
```

Also set your private key environment variable and infura or other RPC environment variable.
   
3. Set the `conversationId` in `getTwitterReplies.js`

4. Run the script

```sh
node index.js
```