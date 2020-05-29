const today = new Date()

export const state = () => ({
  selectedDate: {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
    date: `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`,
  }
})

export const mutations = {
  changeSelectedDate (state, value) {
    state.selectedDate = value
  }
}

export const actions = {
  change ({commit}, value) {
    commit('changeSelectedDate', value)
  }
}
