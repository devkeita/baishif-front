<template>
  <v-app>

    <v-card>

      <v-card-title>
        <v-btn @click="prev">
          <v-icon size="30">mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn @click="next">
          <v-icon size="30">mdi-chevron-right</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="showShare">
          {{ selectedYear }}年 {{ selectedMonth }}月
        </v-btn>

        <v-dialog
          v-model="shareDialog"
          max-width="290"
        >
          <v-card>
            <v-card-title>共有</v-card-title>

            <v-card-text>
              知り合いにこのシフトを共有する共有する
              <v-alert v-model="shareErr" type="error" dismissible>シフトが追加されていないので共有できません。</v-alert>
            </v-card-text>

            <v-card-actions>

              <template v-if="shares[selectedMonth]">
                <v-btn :href="`http://localhost:3000/shift/share?shareId=${this.shares[this.selectedMonth]}`" target="_blank" >
                  リンクを開く
                  <v-icon>mdi-book-plus-multiple</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="deleteShare">
                  共有停止
                </v-btn>
              </template>
              <template v-if="!shares[selectedMonth]">
                <v-btn @click="setShare">
                  共有する
                </v-btn>
              </template>

            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-card-title>

      <v-sheet class="text-right">
        給料：
        <template v-if="salaries[`${selectedYear}-${selectedMonth}`]">
          {{ salaries[`${selectedYear}-${selectedMonth}`] }}円
        </template>
        <template v-else>
          0円
        </template>
      </v-sheet>

      <v-card-text v-if="loading === false">

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
                day.day !== '' ? 'date_panel': 'panel',
                {today: isToday(day.day)}
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
        {{ selectedDate.month }}月{{ selectedDate.day }}日

        <v-list>
          <template v-for="shift in days[selectedDate.date]">
            <v-list-item :to="{ name: 'shift-id', params: { id: shift.id } }" class="py-0 list-border">
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

        <v-btn block @click="addShift">シフトを追加</v-btn>

        <v-dialog
          v-model="needLoginDialog"
          max-width="290"
        >
          <v-card>
            <v-card-title class="headline">ログインが必要です。</v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="grey lighten-8"
                @click="needLoginDialog = false"
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
    data () {
      return {
        shareErr: false,
        shares: [],
        loading: true,
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
        needLoginDialog: false,
        shareDialog: false,
        salaries: [],
      }
    },
    methods: {
      prev () {
        this.selectedMonth--
        if (this.selectedMonth < 1) {
          this.selectedYear--
          this.selectedMonth = 12
        }
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
          this.$store.dispatch('selectedDate/change', this.selectedDate)
        }
      },
      addShift () {
        if (!this.$auth.loggedIn) {
          this.needLoginDialog = true
        } else {
          this.$router.push('/shift/create')
        }
      },
      showShare () {
        this.shareErr = false
        if (!this.$auth.loggedIn) {
          this.needLoginDialog = true
        } else {
          this.shareDialog = true
        }
      },
      existShift (day) {
        if (this.days[`${this.selectedYear}-${this.selectedMonth}-${day}`] && day) {
          return true
        }
        return false
      },
      isToday (day) {
        const today = new Date()
        return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}` === `${this.selectedYear}-${this.selectedMonth}-${day}`
      },
      convertTime (stringDate) {
        let date = new Date(stringDate)
        return `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`
      },
      makeCalendar () {
        const startDate = new Date(this.selectedYear, this.selectedMonth - 1, 1) // 月の最初の日を取得
        const endDate = new Date(this.selectedYear, this.selectedMonth,  0) // 月の最後の日を取得
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
        this.loading = false
      },
      setShare () {
        this.$axios.patch(`shift/share/set?year=${this.selectedYear}&month=${this.selectedMonth}`)
          .then((response) => {
            if (response.data === 'err') {
              return
            }

            if (response.data === 400) {
              this.shareErr = true
              return
            }
            this.shares[this.selectedMonth] = response.data
            this.shareDialog = false
            this.shareDialog = true
          })
      },
      deleteShare () {
        this.$axios.patch(`shift/share/delete?shareId=${this.shares[this.selectedMonth]}`)
          .then((response) => {
            this.shares[this.selectedMonth] = null
            this.shareDialog = false
            this.shareDialog = true
          })
          .catch(() => {
            console.log('error')
          })
      },
    },
    created() {
      this.selectedDate = this.$store.state.selectedDate.selectedDate

      this.selectedYear = this.selectedDate.year
      this.selectedMonth = this.selectedDate.month
    },
    watch: {
      selectedMonth: function () {
        this.makeCalendar()
      },
      selectedYear: function () {
        if (this.$auth.loggedIn) {
          this.loading = true
          this.$axios.get(`shift?year=${this.selectedYear}`)
            .then((response) => {
              let shifts = response.data

              this.days = []
              for (let i = 0; i < shifts.length; i++) {
                const date = new Date(shifts[i].start_at)
                this.days[`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`] = []
                this.days[`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`].push(shifts[i])

                if (!this.salaries[`${date.getFullYear()}-${date.getMonth()+1}`]) {
                  this.salaries[`${date.getFullYear()}-${date.getMonth()+1}`] = 0
                }
                this.salaries[`${date.getFullYear()}-${date.getMonth()+1}`] += shifts[i].salary
                this.shares[date.getMonth()+1] = shifts[i].share_id
              }

              this.makeCalendar()
            })
        }
      }
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
