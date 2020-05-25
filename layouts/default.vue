<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      fixed
      app
    >

      <!--   ログイン関係なし    -->
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          nuxt
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <!--      ログイン関係なし-->

        <!--      ログインしているとき-->

        <template v-if="this.$auth.loggedIn">
          <v-list-item
            v-for="item in securedItems"
            :key="item.title"
            :to="item.to"
            nuxt
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="logout">
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>ログアウト</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <!--      ログインしているとき-->

        <!--   ログインしていないとき    -->

        <template v-else>
          <v-list-item
            v-for="item in unSecuredItems"
            :key="item.title"
            :to="item.to"
            nuxt
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </template>

        <!--      ログインしていないとき-->

      </v-list>

    </v-navigation-drawer>

    <v-app-bar
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'Welcome',
          to: '/',
        },
      ],
      securedItems: [
        {
          icon: 'mdi-briefcase',
          title: 'バイト先',
          to: '/company',
        },
      ],
      unSecuredItems: [
        {
          icon: 'mdi-exit-to-app',
          title: 'ログイン',
          to: '/login',
        },
        {
          icon: 'mdi-account-box',
          title: '登録',
          to: '/register',
        },
      ],
      miniVariant: false,
      title: 'バイシフ'
    }
  },
  methods: {
    logout() {
      this.$auth.logout();
    },
  }
}
</script>
