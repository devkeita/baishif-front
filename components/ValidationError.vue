<template>
  <ul class="mb-3">
    <li v-for="error in errors" class="red--text mb-1">
      {{ error }}
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      'errors': {
        type: Array,
        default: [],
      }
    }
  }
</script>

<style scoped>

</style>
