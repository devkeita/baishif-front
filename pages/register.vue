<template>
  <v-app>
    <v-card>
      <v-card-title>
        <h1 class="display-1">登録</h1>
        <v-spacer></v-spacer>
        <v-sheet dark class="body-1">
          すでにアカウントをお持ちの方は
          <nuxt-link to="/login">ログインへ</nuxt-link>
        </v-sheet>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="名前" v-model="name" />
          <validation-error :errors="err.name"></validation-error>
          <v-text-field label="メールアドレス" v-model="email" />
          <validation-error :errors="err.email"></validation-error>
          <v-text-field type="password" label="パスワード" v-model="password" />
          <validation-error :errors="err.password"></validation-error>
          <v-text-field type="password" label="パスワード" v-model="password_confirmation" />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="registerWithAuthModule">登録</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
  import ValidationError from "../components/ValidationError";

  export default {
    components: {ValidationError},
    auth: false,
    middleware({ store, redirect }) {
      if(store.$auth.loggedIn) {
        redirect('/');
      }
    },
    data() {
      return {
        name: null,
        email: null,
        password: null,
        password_confirmation: null,
        errTemplate: {
          name: [],
          email: [],
          password: [],
        },
        err: null,
      }
    },
    methods: {
      registerWithAuthModule() {
        this.$axios.post('register', {
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation,
        })
        .then((response) => {
          this.$auth.loginWith('local',{
            data: {
              email: this.email,
              password: this.password,
            }
          })
          .then((response) => {
            this.$router.push('/')
          })
        })
        .catch((error) => {
          this.err = {...this.errTemplate, ...error.response.data.errors}
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
