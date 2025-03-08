<script setup lang="ts">
import {RouterView} from 'vue-router'

const routes = [
  {path: '/', icon: 'home', title: 'Home'},
  {path: '/documents', icon: 'file-document', title: 'Documents'},
];
</script>

<template>
  <v-layout>
    <v-app-bar>
      <v-app-bar-title>ODI</v-app-bar-title>
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
