<template>
  <div
    class="square"
    :style="{ 'grid-template': `repeat(${size}, 1fr) / repeat(${size}, 1fr)` }"
  >
    <div
      v-for="(c, i) in list"
      :key="i"
      class="square__cell"
      :class="selections && selections.hasOwnProperty(c) ? selections[c] : null"
    >
      {{ c }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Square',
    props: {
      square: { required: true, type: Array },
      selections: { type: Object },
    },
    computed: {
      size () {
        return this.square.length
      },
      list () {
        let result = []
        this.square.forEach(row => result = result.concat(row))
        return result
      },
    },
  }
</script>

<style lang="postcss" rel="stylesheet">

  .square {
    display: grid;
    grid-gap: 3px;
    width: fit-content;
    padding: 20px;
  }

</style>
