<template>
  <v-app>
    <v-card>
      <v-card-title>
        <h1 class="display-1">ログイン</h1>
        <v-spacer></v-spacer>
        <v-sheet dark class="body-1">
          アカウントをお持ちでない方は
          <nuxt-link to="/register">登録へ</nuxt-link>
        </v-sheet>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="メールアドレス" v-model="email" />
          <v-text-field type="password" label="パスワード" v-model="password" />
          <v-alert v-model="err" type="error" dismissible>メールアドレスまたはパスワードが間違っています。</v-alert>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="loginWithAuthModule">ログイン</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
  export default {
    name: "login.vue",
    data() {
      return {
        email: null,
        password: null,
        err: false,
      }
    },
    methods: {
      loginWithAuthModule () {
        this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password
          }
        })
        .catch((error) => {
          this.err = true
        })
      }
    }
  }
</script>

<style scoped>

</style>
