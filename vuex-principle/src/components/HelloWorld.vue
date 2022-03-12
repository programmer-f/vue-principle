<template>
  <div class="hello">
    <div>{{ $store.state.name }}</div>
    <input type="text" v-model="$store.state.name" />
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
};
</script>

<style scoped></style>
