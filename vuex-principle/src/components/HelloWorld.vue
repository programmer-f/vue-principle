<template>
  <div class="hello">
    <div>{{ $store.getters.myName }}</div>
    <div>num:{{ $store.state.num }}</div>
    <button @click="handleAddNum">addNum</button>
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
  },
};
</script>

<style scoped></style>
