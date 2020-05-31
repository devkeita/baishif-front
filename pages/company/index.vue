<template>
  <v-app>
    <v-list flat>
      <v-list-item-group>
        <template v-for="company in companies">
          <v-list-item :key="company.id" :to="{ name: 'company-id', params: { id: company.id } }">
            <v-list-item-content>
              <v-list-item-title v-text="company.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list-item-group>
    </v-list>
    <v-btn to="/company/create">バイト先を追加する</v-btn>
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
      this.$axios.get('company')
      .then((response) => {
        this.companies = response.data
      })
    },
  }
</script>

<style scoped>

</style>
