<template>
  <div class="hello">
    <div>{{ $store.getters.myName }}</div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  created() {
    console.log(this.$store);
  },
};
</script>

<style scoped></style>
