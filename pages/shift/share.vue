<template>
  <v-app>

    <v-card>

      <v-card-title>
        <v-spacer></v-spacer>
        {{ year }}年 {{ month }}月

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
              :id="`${year}-${month}-${day.day}`"
              @click="selected"
              :class="[
                {selected: selectedDate.date === `${year}-${month}-${day.day}`},
                day.day !== '' ? 'date_panel': 'panel',
              ]"
              style="position: relative"
            >
              {{ day.day }}
              <v-icon v-if="existShift(day.day)" class="shift">
                mdi-circle-medium
              </v-icon>
            </v-col>
          </v-layout>
        </div>

      </v-card-text>

      <v-card-text class="text-center">
        {{ month }}月{{ selectedDate.day }}日

        <v-list>
          <template v-for="shift in days[selectedDate.date]">
            <v-list-item class="py-0 list-border">
              <v-list-item-content class="py-0">
                <v-sheet>
                  バイト先： {{ shift.company.name }}
                  <v-spacer></v-spacer>
                  時間： {{ convertTime(shift.start_at) }} 〜 {{ convertTime(shift.finish_at) }}
                  <v-spacer></v-spacer>
                  給料： {{ shift.salary }}円
                </v-sheet>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>

      </v-card-text>

    </v-card>

    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">URLが正しくありません</v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="dark"
            to="/"
          >
            トップページ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
  export default {
    auth: false,
    data () {
      return {
        dialog: false,
        weeks: ['日', '月', '火', '水', '木', '金', '土'],
        year: null,
        month: null,
        calDays: null,
        days: [],
        selectedDate: {
          day: null,
          date: null,
        },
      }
    },
    methods: {
      makeCalendar () {
        const startDate = new Date(this.year, this.month - 1, 1) // 月の最初の日を取得
        const endDate = new Date(this.year, this.month,  0) // 月の最後の日を取得
        const endDayCount = endDate.getDate() // 月の末日
        const startDay = startDate.getDay() // 月の最初の日の曜日を取得
        let dayCount = 1 // 日にちのカウント

        this.calDays = []
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
      },
      existShift (day) {
        if (this.days[`${this.year}-${this.month}-${day}`] && day) {
          return true
        }
        return false
      },
      convertTime (stringDate) {
        let date = new Date(stringDate)
        return `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`
      },
      selected (e) {
        if (e.target.classList["value"].match('date_panel')) {
          const date = new Date(e.target.id)
          this.selectedDate = {
            day: date.getDate(),
            date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
          }
        }
      },
    },
    created() {
      this.$axios.get(`shift/share?shareId=${this.$route.query.shareId}`)
      .then((response) => {
        let shifts = response.data

        this.days = []
        for (let i = 0; i < shifts.length; i++) {
          const date = new Date(shifts[i].start_at)
          this.days[`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`] = []
          this.days[`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`].push(shifts[i])
        }

        const date = new Date(shifts[0].start_at)
        this.year = date.getFullYear()
        this.month = date.getMonth() + 1
        this.selectedDate.day = 1
        this.selectedDate.date = `${this.year}-${this.month}-${this.selectedDate.day}`

        this.makeCalendar()
      })
      .catch(() => {
        this.dialog = true
      })
    }
  }
</script>

<style scoped>
  .panel {
    border: 1px solid #212121;
    padding-bottom: 19px;
    text-align: center;
  }
  .date_panel {
    border: 1px solid #212121;
    padding-bottom: 19px;
    text-align: center;
  }
  .selected {
    background: rgba(150, 150, 150, 0.5);
  }
  .today {
    border-color: rgba(150, 150, 150, 0.5);
  }
  .shift {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
  }
  .list-border {
    border: 1px solid #515151;
  }
</style>
