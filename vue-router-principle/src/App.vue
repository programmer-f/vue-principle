<template>
  <div id="app">
    <router-link to="/home">首页</router-link>|
    <router-link to="/about">关于</router-link>
    <router-view />

    <!-- <a href="#/home">首页</a>
    <a href="#/about">关于</a> -->
    <!-- <Home />
    <About /> -->
  </div>
</template>
<!--
  1.VueRouter的本质:
  根据“不同的hash值”或者“不同的路径地址”，将不同的内容渲染到router-view中
  所以实现VueRouter的核心关键点就在于如何监听‘hash’或者‘路径’的变化，再将不同内容写到router-view中
-->

<script>
import Home from './views/HomeView.vue';
import About from './views/AboutView.vue';
export default {
  name: 'App',
  components: {
    Home,
    About,
  },
  mounted() {
    // console.log('App', this.$router);
    // console.log('App', this.$route);
  },
};
</script>

<style></style>
