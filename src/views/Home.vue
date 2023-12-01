<template>
  <div>
    <h1>Home</h1>
    <router-link to="/game">Go to Game</router-link>
    <button @click="goToGame">Go to Game (Button)</button>
  </div>
</template>

<script type="module" src="../Home.js"></script>

<style scoped>
    button {
      margin-top: 10px;
      padding: 10px;
      font-size: 16px;
      cursor: pointer;
    }
</style>
