<template>
  <div class="relative">
    <input
      v-model="searchTerm"
      @input="onInput"
      @focus="showResults = true"
      @blur="hideResults"
      class="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
      type="text"
      :placeholder="$t('Search')"
    />

    <ul v-if="showResults" class="mt-2 bg-white border border-gray-300 rounded-md shadow-lg absolute z-10 w-full max-h-100 overflow-y-scroll">
      <li v-for="(result, index) in filteredResults" :key="index" @click="onResultClick(result)" class="px-4 py-2 cursor-pointer hover:bg-gray-100">
        <slot name="result-item" :result="result">
          {{ result[labelKey] }}
        </slot>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    maxResults: {
      type: Number,
      default: 100,
    },

    labelKey: {
      type: String,
      default: 'label', // The default property to use as the label
    },
  },
  data() {
    return {
      searchTerm: '',
      showResults: false,
    };
  },
  computed: {
    filteredResults() {
      return this.options
        .filter((option) => option[this.labelKey].toLowerCase().includes(this.searchTerm.toLowerCase()))
        .slice(0, this.maxResults);
    },
  },
  methods: {
    onInput() {
      this.showResults = true;
    },
    hideResults() {
      // Delay hiding the results to allow clicks on the results list
      setTimeout(() => {
        this.showResults = false;
      }, 200);
    },
    onResultClick(result) {
      this.searchTerm = '';
      this.showResults = false;
      this.$emit('selected', result);
    },
  },
};
</script>

<style>
/* Add Tailwind classes here if needed */
</style>
