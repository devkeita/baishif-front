<template>
  <v-app>
    <v-list flat>
      <v-list-item-group>
        <template v-for="company in companies">
          <v-list-item :key="company.name" to="/" @click="hello">
            <v-list-item-content>
              <v-list-item-title v-text="company.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list-item-group>
    </v-list>
    <v-btn>バイト先を追加する</v-btn>
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        companies: [],
      }
    },
    mounted() {
      this.$axios.get('/api/company')
      .then((response) => {
        this.companies = response.data
      })
    },
    methods: {
      hello() {
        console.log('hello')
      }
    }
  }
</script>

<style scoped>

</style>
