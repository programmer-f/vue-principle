<template>
  <div class="hello">
    <div>{{ $store.getters.myName }}</div>
    <div>num:{{ $store.state.num }}</div>
    <button @click="handleAddNum">addNum</button>
    <div>age:{{ $store.state.age }}</div>
    <button @click="handleAddAge">addAge</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  created() {
    // console.log(this.$store);
  },
  methods: {
    handleAddNum() {
      this.$store.commit('addNum', 10);
    },
    handleAddAge() {
      this.$store.dispatch('asyncAddAge', 5);
    },
  },
};
</script>

<style scoped></style>
