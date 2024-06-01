<template>
  <div class="myTracks" style="text-align:center;">
    <h1>Your favorite songs last 4 weeks</h1>
    <div v-if="!auth">
      <button @click="spotifyLogin">Authentication</button>
    </div>
    <br>
    <div v-if="myTracks != null">
      <ul style="list-style: none;">
        <li v-for="(val, k) in myTracks" :key="k">
          <img :src="val.url" />
          <div>アーティスト名:{{ val.artist_name }}</div>
          <div>曲名:{{ val.name }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data: function () {
    return {
      auth: 0,
      init: 0,
      tracks: null,
      myTracks: null,
      selected: '',
    }
  },
  props: {
    routeParams: Object
  },
  created: function () {
    if (this.$route.hash) {
      this.$router.push(this.$route.fullPath.replace('#', '?'))
      this.auth = 1
    }
  },
  updated() {
    // 認証後、初回のみ実行
    if (this.auth && !this.init) {
      this.init = 1
      this.getmyTracks()
    }
  },
  methods: {
    spotifyLogin: function () {
      let endpoint = 'https://accounts.spotify.com/authorize'
      let response_type = 'token'
      let client_id = process.env.VUE_APP_SPOTIFY_CLIENT_ID;
      let redirect_uri = 'http://localhost:8081'
      let scope = 'user-top-read'
      location.href = endpoint +
        '?response_type=' + response_type +
        '&client_id=' + client_id +
        '&redirect_uri=' + redirect_uri +
        '&scope=' + scope
    },
    async getmyTracks() {
      const endpoint = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10'
      const data = {
        headers: {
          'Authorization': this.routeParams.token_type + ' ' + this.routeParams.access_token
        },
      }
      // 自分がよく聴く曲を取得する
      const tracks = []
      await axios.get(endpoint, data).then(res => {
        this.tracks = res.data.items
      })
        .catch(err => {
          console.error(err)
        })

      // 取得した曲のデータを一つ一つ取得する
      for (let i = 0; i < this.tracks.length; i++) {
        await axios.get('https://api.spotify.com/v1/audio-features/' + this.tracks[i].id, data).then(
          tracks.push({
            url: this.tracks[i].album.images[1].url,
            name: this.tracks[i].name,
            artist_name: this.tracks[i].artists[0].name
          })
        )
      }
      this.myTracks = tracks
    },
  }
}
</script>
