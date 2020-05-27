<template>
  <calendar :shifts="shifts"></calendar>
</template>

<script>
  import calendar from "../components/Calendar2";
  export default {
    components: {calendar},
    auth: false,
    data () {
      return {
        shifts: [],
      }
    },
    async asyncData ({app}) {
      if (app.$auth.loggedIn) {
        const data = await app.$axios.get(`/api/shift`)
        return {shifts: data.data}
      }
    },
  }
</script>
