<template>
  <v-app>

    <v-card>

      <v-card-title>
        <v-btn>
          <v-icon @click="prev" size="30">mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn>
          <v-icon @click="next" size="30">mdi-chevron-right</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        {{ selectedYear }}年 {{ selectedMonth }}月
      </v-card-title>

      <v-card-text>

        <div>
          <v-layout row>
            <v-col v-for="week in weeks" class="panel">{{ week }}</v-col>
          </v-layout>
        </div>

        <div v-for="calDay in calDays">
          <v-layout row>
            <v-col
              v-for="day in calDay"
              :id="`${selectedYear}-${selectedMonth}-${day.day}`"
              @click="selected"
              :class="[
                {selected: selectedDate.date === `${selectedYear}-${selectedMonth}-${day.day}`},
                day.day !== '' ? 'date_panel': 'panel'
              ]"
            >
              {{ day.day }}
            </v-col>
          </v-layout>
        </div>

      </v-card-text>

      <v-card-text class="text-center">
        {{ selectedDate.month }}月{{ selectedDate.day }}日

        <v-list>
          <v-list-item
            v-for="shift in days[selectedDate.date]"
          >
            <v-list-item-title>
              {{ shift.start_at }}
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <v-btn block @click="addShift">シフトを追加</v-btn>

        <v-dialog
          v-model="dialog"
          max-width="290"
        >
          <v-card>
            <v-card-title class="headline">ログインが必要です。</v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="grey lighten-8"
                @click="dialog = false"
              >
                閉じる
              </v-btn>

              <v-btn
                color="dark"
                to="/login"
              >
                ログイン
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-card-text>

    </v-card>


  </v-app>
</template>

<script>
  export default {
    props: {
      'shifts': {
        type: Array,
        default: [],
      }
    },
    data () {
      return {
        days: [],
        weeks: ['日', '月', '火', '水', '木', '金', '土'],
        calDays: [],
        selectedYear: null,
        selectedMonth: null,
        selectedDate: {
          year: null,
          month: null,
          day: null,
          date: null,
        },
        dialog: false,
      }
    },
    methods: {
      prev () {
        this.selectedMonth--
        if (this.selectedMonth < 1) {
          this.selectedYear--
          this.selectedMonth = 12
        }
        console.log(this.selectedDate)
      },
      next () {
        this.selectedMonth++
        if (this.selectedMonth > 12) {
          this.selectedYear++
          this.selectedMonth = 1
        }
      },
      selected (e) {
        if (e.target.classList["value"].match('date_panel')) {
          const date = new Date(e.target.id)
          this.selectedDate = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
          }
        }
      },
      addShift () {
        if (!this.$auth.loggedIn) {
          this.dialog = true
        } else {
          this.$router.push('/')
        }

      }
    },
    created() {
      let date = new Date()
      this.selectedYear = date.getFullYear()
      this.selectedMonth = date.getMonth() + 1
      this.selectedDate = {
        year: this.selectedYear,
        month: this.selectedMonth,
        day: date.getDate(),
        date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
      }
    },
    watch: {
      selectedMonth: function () {
        this.calDays = []

        const startDate = new Date(this.selectedYear, this.selectedMonth - 1, 1) // 月の最初の日を取得
        const endDate = new Date(this.selectedYear, this.selectedMonth,  0) // 月の最後の日を取得
        const endDayCount = endDate.getDate() // 月の末日
        const startDay = startDate.getDay() // 月の最初の日の曜日を取得
        let dayCount = 1 // 日にちのカウント

        this.days = []
        for (let i = 1; i <= endDayCount; i++) {
          this.days[`${this.selectedYear}-${this.selectedMonth}-${i}`] = []
        }

        this.shifts.forEach((value) => {
          const date = new Date(value.start_at)
          if (date.getFullYear() === this.selectedDate.year && date.getMonth()+1 === this.selectedDate.month) {
            this.days[`${this.selectedYear}-${this.selectedMonth}-${date.getDate()}`].push(value)
          }
        })

        for (let w = 0; w < 6; w++) {

          this.calDays.push([])

          for (let d = 0; d < 7; d++) {
            if (w === 0 && d < startDay) {
              // 1行目で1日の曜日の前
              this.calDays[w].push({day: ''})
            } else if (dayCount > endDayCount) {
              // 末尾の日数を超えた
              this.calDays[w].push({day: ''})
            } else {
              this.calDays[w].push({day: dayCount})
              dayCount++
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  .panel {
    padding-bottom: 19px;
    text-align: center;
  }
  .date_panel {
    padding-bottom: 19px;
    text-align: center;
  }
  .selected {
    background: rgba(150, 150, 150, 0.5);
  }
</style>
