<script setup lang="ts">
import {RouterView} from 'vue-router'
import {ref} from 'vue'

const routes = [
  {path: '/', icon: 'home', title: 'Home'},
  {path: '/documents', icon: 'file-document', title: 'Documents'},
];

const darkMode = ref(false);
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
};
</script>

<template>
  <v-layout>
    <v-app-bar>
      <v-app-bar-title>ODI</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" @click="toggleDarkMode">
            {{ darkMode.value ? 'mdi-weather-night' : 'mdi-weather-sunny' }}
          </v-icon>
        </template>
        <span>Toggle Dark Mode</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on">
            mdi-help-circle
          </v-icon>
        </template>
        <span>This application helps you manage and search documents.</span>
      </v-tooltip>
    </v-app-bar>
    <v-navigation-drawer>
      <v-list>
        <v-list-item
            v-for="route in routes"
            :key="route.title"
            :to="route.path"
            :title="route.title"
            :prepend-icon="'mdi-' + route.icon"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">
                {{ 'mdi-' + route.icon }}
              </v-icon>
            </template>
            <span>{{ route.title }}</span>
          </v-tooltip>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="main">
      <RouterView/>
    </v-main>
  </v-layout>
</template>

<style lang="scss" scoped>
.main {
  $margin: 24px;
  width: calc(100% - $margin*2);
  margin: $margin $margin 0 $margin;
}
</style>
