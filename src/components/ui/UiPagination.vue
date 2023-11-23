<template>
  <div
    v-if="totalPages !== 1 && totalPages !== 0"
    class="flex items-center justify-between"
  >
    <div class="flex-1 flex items-center">
      <div>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <a
            href="#"
            class="relative inline-flex items-center
            px-2 py-2 rounded-l-sm border border-gray-300 bg-white text-sm"
            :class="{'hover:bg-gray-200 text-primary-600': current !== 1, 'text-gray-600': current === 1 }"
            @click.prevent="changePage(prevPage)"
          >
            <span class="sr-only">Previous</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </a>
          <a
            v-if="firstElem !== 1"
            href="#" aria-current="page"
            class="bg-white border-gray-300 text-primary-500 relative inline-flex items-center px-4 py-2 border text-sm"
            :class="{'hover:bg-gray-200': current !== 1}"
            @click.prevent="changePage(1)"
          >
            1
          </a>
          <span
            v-if="hasFirst"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm text-gray-600">
            ...
          </span>
          <a
            v-for="(page, i) in pages"
            :key="i"
            href="#"
            class="bg-white border-gray-300 text-primary-500 relative inline-flex items-center px-4 py-2 border text-sm"
            :class="{'z-10 bg-primary-500 !border-primary-500 !text-white': current === page, 'hover:bg-gray-200': current !== page}"
            @click.prevent="changePage(page)"
          >
            {{ page }}
          </a>
          <span
            v-if="hasLast"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm text-gray-700">
            ...
          </span>

          <a
            v-if="lastElem !== totalPages"
            href="#"
            class="bg-white border-gray-300 text-primary-500 relative inline-flex items-center px-4 py-2 border text-sm"
            :class="{'hover:bg-gray-200': current !== lastElem}"
            @click.prevent="changePage(totalPages)"
          >
            {{ totalPages }}
          </a>
          <a
            href="#"
            class="relative inline-flex items-center
            px-2 py-2 rounded-r-sm border border-gray-300 bg-white text-sm"
            :class="{'hover:bg-gray-200 text-primary-500': current !== lastElem, 'cursor-default text-gray-600': current === lastElem }"
            @click.prevent="changePage(nextPage)"
          >
            <span class="sr-only">Next</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    current: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 10,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    maxVisibleButtons: {
      type: Number,
      required: false,
      default: 3,
    },
  },

  data() {
    return {
      input: '',
    };
  },

  computed: {
    pages() {
      const range = [];
      for (let i = this.startPage; i <= this.endPage; i++) {
        range.push(i);
      }
      return range;
    },

    startPage() {
      if (this.current === 1) {
        return 1;
      }
      if (this.current === this.totalPages) {
        const start = this.totalPages - this.maxVisibleButtons + 1;
        return (start > 0) ? start : 1;
      }
      return this.current - 1;
    },

    endPage() {
      return Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);
    },

    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },

    nextPage() {
      return this.current + 1;
    },

    prevPage() {
      return this.current - 1;
    },

    firstElem() {
      return this.pages[0];
    },

    lastElem() {
      return this.pages[this.pages.length - 1];
    },

    hasFirst() {
      const start = this.firstElem - 1;
      return ((start > 0) ? start : 1) !== 1;
    },

    hasLast() {
      return this.endPage + 1 < this.totalPages;
    },
  },

  methods: {
    changePage(page: number) {
      if (page > 0 && page <= this.totalPages) {
        this.$emit('page-change', page);
      }
    },
  },
});
</script>
