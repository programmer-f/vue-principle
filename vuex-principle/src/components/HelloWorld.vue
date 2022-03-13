<template>
  <div class="hello">
    <p>{{ $store.state.globalName }}</p>
    <p>{{ $store.getters.getGlobalName }}</p>
    <button @click="changeGlobalName1">同步改变</button>
    <button @click="changeGlobalName2">异步改变</button>
    <hr />
    <p>{{ $store.state.home.homeName }}</p>
    <p>{{ $store.getters.getHomeName }}</p>
    <button @click="changeHomeName1">同步改变</button>
    <button @click="changeHomeName2">异步改变</button>
    <hr />
    <p>{{ $store.state.account.accountName }}</p>
    <p>{{ $store.getters.getAccountName }}</p>
    <button @click="changeAccountName1">同步改变</button>
    <button @click="changeAccountName2">异步改变</button>
    <hr />
    <p>{{ $store.state.account.login.loginName }}</p>
    <p>{{ $store.getters.getLoginName }}</p>
    <button @click="changeLoginName1">同步改变</button>
    <button @click="changeLoginName2">异步改变</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  created() {},
  methods: {
    changeGlobalName1() {
      this.$store.commit('changeGlobalName', 111111);
    },
    changeGlobalName2() {
      this.$store.dispatch('asyncChangeGlobalName', 5);
    },
    changeHomeName1() {
      this.$store.commit('changeHomeName', 222222);
    },
    changeHomeName2() {
      this.$store.dispatch('asyncChangeHomeName', 5);
    },
    changeAccountName1() {
      this.$store.commit('changeAccountName', 333333);
    },
    changeAccountName2() {
      this.$store.dispatch('asyncChangeAccountName', 5);
    },
    changeLoginName1() {
      this.$store.commit('changeLoginName', 444444);
    },
    changeLoginName2() {
      this.$store.dispatch('asyncChangeLoginName', 5);
    },
  },
};
</script>

<style scoped></style>
