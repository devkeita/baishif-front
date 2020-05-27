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

      <v-img>

        <v-simple-table light>

          <thead>
          <tr>
            <td v-for="week in weeks">{{ week }}</td>
          </tr>
          </thead>

          <tr v-for="calDay in calDays">
            <td
              v-for="day in calDay"
              :id="`${selectedYear}-${selectedMonth}-${day}`"
              @click="selected"
              :class="{selected: selectedDate === `${selectedYear}-${selectedMonth}-${day}`}"
            >
              {{ day }}
            </td>
          </tr>

        </v-simple-table>

      </v-img>

    </v-card>


  </v-app>
</template>

<script>

  export default {
    data () {
      return {
        weeks: [],
        calDays: [],
        selectedYear: null,
        selectedMonth: null,
        selectedDate: null,
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
        this.selectedDate = e.target.id
      },
    },
    created() {
      const today = new Date()
      this.selectedDate = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`
      this.selectedYear = today.getFullYear()
      this.selectedMonth = today.getMonth() + 1
    },
    watch: {
      selectedMonth: function () {
        this.calDays = []
        this.weeks = ['日', '月', '火', '水', '木', '金', '土']

        const startDate = new Date(this.selectedYear, this.selectedMonth - 1, 1) // 月の最初の日を取得
        const endDate = new Date(this.selectedYear, this.selectedMonth,  0) // 月の最後の日を取得
        const endDayCount = endDate.getDate() // 月の末日
        const startDay = startDate.getDay() // 月の最初の日の曜日を取得
        let dayCount = 1 // 日にちのカウント

        for (let w = 0; w < 6; w++) {

          this.calDays.push([])

          for (let d = 0; d < 7; d++) {
            if (w == 0 && d < startDay) {
              // 1行目で1日の曜日の前
              this.calDays[w].push('')
            } else if (dayCount > endDayCount) {
              // 末尾の日数を超えた
              this.calDays[w].push('')
            } else {
              this.calDays[w].push(dayCount)
              dayCount++
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  td:first-child {
    color: red;
  }
  td:last-child {
    color: blue;
  }
  td {
    border: 1px solid #ddd;
    padding-bottom: 9px;
    text-align: center;
  }
  td.selected {
    background-color: #E0E0E0;
  }
</style>
