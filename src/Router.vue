<template>
    <div id="app">
      <router-view v-if="!loggedIn"/> <!-- Exibe a rota padrão quando o usuário não estiver logado -->
    </div>
  </template>
  
  <script>

  
  export default {
    name: 'App',
    data() {
      return {
        loggedIn: false,
      };
    },
  };
  </script>
  