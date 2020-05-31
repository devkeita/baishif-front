<template>
  <v-app>
    <v-card>
      <v-card-title>
        <h1 class="display-1">バイト先追加</h1>
      </v-card-title>
      <v-card-text>
        <v-form>

          <v-text-field label="名前" v-model="company.name" />
          <validation-error :errors="err.name" />

          <v-text-field type="number" label="時給" v-model="company.hourly_rate" />
          <validation-error :errors="err.hourly_rate" />

          <v-text-field type="number" label="時給（休日）" v-model="company.holiday_hourly_rate" />
          <validation-error :errors="err.holiday_hourly_rate" />

          <v-text-field type="number" label="深夜手当（％）" v-model="company.midnight_hourly_rate_increase_rate" />
          <validation-error :errors="err.midnight_hourly_rate_increase_rate" />

          <v-text-field type="number" label="交通費" v-model="company.transportation_costs" />
          <validation-error :errors="err.transportation_costs" />

          <v-card-actions>
            <v-btn nuxt to="/company">戻る</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="addCompany">追加</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
    import ValidationError from "../../components/ValidationError";
    export default {
      components: {ValidationError},
      data() {
        return {
          company: {
            name: null,
            hourly_rate: 0,
            holiday_hourly_rate: 0,
            midnight_hourly_rate_increase_rate: 0,
            transportation_costs: 0,
          },
          errTemplate: {
            name: [],
            hourly_rate: [],
            holiday_hourly_rate: [],
            midnight_hourly_rate_increase_rate: [],
            transportation_costs: [],
          },
          err: null,
        }
      },
      methods: {
        addCompany() {
          this.$axios.post('company', this.company)
          .then((response) => {
            this.$router.push('/company')
          })
          .catch((err) => {
            this.err = {...this.errTemplate, ...err.response.data.errors}
          })
        }
      },
      beforeMount() {
        this.err = this.errTemplate
      },
    }
</script>

<style scoped>

</style>
