<template>
  <v-app>
    <v-card>
      <v-card-title>
        <h1 class="display-1">シフト追加【{{ selectedDate.month }}月{{ selectedDate.day }}日】</h1>
      </v-card-title>
      <v-card-text>
        <v-form>

          <v-select label="バイト先" :items="companies" v-model="shift.company_id" />
          <validation-error :errors="err.company_id" />

          <v-select label="確定or未確定" :items="statusItems" v-model="shift.status" />
          <validation-error :errors="err.status" />

          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="start_at"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="start_at"
                label="開始時間"
                readonly
                v-on="on"
              ></v-text-field>
              <validation-error :errors="err.start_at" />
            </template>
            <v-time-picker
              v-if="modal"
              v-model="start_at"
              full-width
              format="24hr"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modal = false">キャンセル</v-btn>
              <v-btn text color="primary" @click="$refs.dialog.save(start_at)">OK</v-btn>
            </v-time-picker>
          </v-dialog>

          <v-dialog
            ref="dialog2"
            v-model="modal2"
            :return-value.sync="finish_at"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="finish_at"
                label="終了時間"
                readonly
                v-on="on"
              ></v-text-field>
              <validation-error :errors="err.finish_at" />
            </template>
            <v-time-picker
              v-if="modal2"
              v-model="finish_at"
              full-width
              format="24hr"
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modal2 = false">キャンセル</v-btn>
              <v-btn text color="primary" @click="$refs.dialog2.save(finish_at)">OK</v-btn>
            </v-time-picker>
          </v-dialog>

          <v-text-field type="number" label="休憩時間(分）" v-model="shift.break_minutes" />
          <validation-error :errors="err.break_minutes" />

          <v-card-actions>
            <v-btn nuxt to="/">戻る</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="save">追加</v-btn>
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
        modal: false,
        modal2: false,
        start_at: null,
        finish_at: null,
        shift: {
          company_id: null,
          status: null,
          start_at: null,
          finish_at: null,
          break_minutes: null,
        },
        statusItems: [
          {
            text: '確定',
            value: 1,
          },
          {
            text: '未確定',
            value: 0,
          }
        ],
        companies: [],
        selectedDate: this.$store.state.selectedDate.selectedDate,
        errTemplate: {
          company_id: [],
          status: [],
          start_at: [],
          finish_at: [],
          break_minutes: [],
        },
        err: null,
      }
    },
    methods: {
      save () {
        this.shift.start_at = `${this.selectedDate.date} ${this.start_at}:00`

        if (this.start_at > this.finish_at) {
          const date = this.selectedDate
          this.shift.finish_at = `${date.year}-${date.month}-${date.day + 1} ${this.finish_at}:00`
        } else {
          this.shift.finish_at = `${this.selectedDate.date} ${this.finish_at}:00`
        }

        this.$axios.post('shift', this.shift)
          .then((response) => {
            this.$router.push('/')
          })
          .catch((err) => {
            this.err = {...this.errTemplate, ...err.response.data.errors}
          })
      }
    },
    beforeMount() {
      this.err = this.errTemplate
    },
    async asyncData ({app}) {
      const data = await app.$axios.get('company')
      let companies = []
      for (let i = 0; i < data.data.length; i++) {
        companies.push({text: data.data[i].name, value: data.data[i].id})
      }
      return {companies: companies}
    }
  }
</script>

<style scoped>

</style>
