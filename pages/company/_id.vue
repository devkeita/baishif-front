<template>
  <v-app>
    <v-card>
      <v-card-title>
        <h1 class="display-1">バイト先追加</h1>
        <v-spacer></v-spacer>
        <v-btn color="red" rounded @click.stop="dialog = true">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-dialog
          v-model="dialog"
          max-width="290"
        >
          <v-card>
            <v-card-title class="headline">削除しますか？</v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="dark"
                @click="dialog = false"
              >
                中止
              </v-btn>

              <v-btn
                color="red"
                @click="deleteCompany"
              >
                削除
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
            <v-btn @click="editCompany">更新</v-btn>
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
      data () {
        return {
          errTemplate: {
            name: [],
            hourly_rate: [],
            holiday_hourly_rate: [],
            midnight_hourly_rate_increase_rate: [],
            transportation_costs: [],
          },
          err: null,
          company: {},
          dialog: false,
        }
      },
      async asyncData ({app, params}) {
        const data = await app.$axios.get(`/api/company/${params.id}`)
        return {company: data.data}
      },
      beforeMount() {
        this.err = this.errTemplate
      },
      methods: {
        editCompany () {
          this.$axios.patch(`/api/company/${this.$route.params.id}`, this.company)
            .then((response) => {
              this.$router.push('/company')
            })
            .catch((err) => {
              this.err = {...this.errTemplate, ...err.response.data.errors}
            })
        },
        deleteCompany () {
          this.$axios.delete(`/api/company/${this.$route.params.id}`)
            .then((response) => {
              this.$router.push('/company')
            })
            .catch((err) => {
              console.log(err)
            })
        }
      }
    }
</script>

<style scoped>

</style>
