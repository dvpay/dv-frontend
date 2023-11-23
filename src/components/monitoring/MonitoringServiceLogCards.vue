<template>
  <div>
    <div class="relative">
      <div class="flex flex-col gap-4">
        <div v-for="(item, i) in data" :key="i" class="w-full wrapper">
          <div class="flex items-center gap-4 border-b border-gray-300 px-6 font-600 py-3 bg-gray-200">
            <div>
              {{ item.startAt }}
            </div>
            <div
              :class="statusClass(item.status)"
            >
              {{ item.status }}
            </div>
          </div>
          <div v-for="(el, j) in item.log" :key="j" class="border-b last:border-b-0">
            <div class="grid gap-2 grid-cols-[170px,1fr] items-center py-2 px-8">
              <div>
                {{ el.createdAt }}
              </div>
              <div class="break-all">
                {{ el.message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ui-loading :loading="loading" />
    <div
      v-if="paginationable"
      class="flex items-center justify-between mt-6"
    >
      <div class="flex items-center gap-2 text-sm">
        <span>{{ $t('Show') }}</span>
        <ui-select
          class="max-w-90px h-38px"
          v-model="perPageComp"
          :options="perPageOptions"
          @change="perPageSelectHandler"
        />
        <span>{{ $t('entries') }}</span>
      </div>
      <ui-pagination
        :current="currentPage"
        :total="totalEntries"
        :per-page="paginationPerPage"
        @page-change="pageChangeHandler"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import UiSelect from '@/components/ui/UiSelect.vue';
import UiPagination from '@/components/ui/UiPagination.vue';
import UiLoading from '@/components/ui/UiLoading.vue';

interface IPerPageOption {
  title: string;
  value: string;
}

export default defineComponent({
  components: {
    UiSelect,
    UiPagination,
    UiLoading,
  },

  props: {
    data: {
      type: Array,
      required: true,
    },

    perPageOptions: {
      type: Array as PropType<IPerPageOption[]>,
      required: false,
      default: () => [
        {
          title: '25',
          value: '25',
        },
        {
          title: '50',
          value: '50',
        },
        {
          title: '100',
          value: '100',
        },
        {
          title: '250',
          value: '250',
        },
      ],
    },

    perPageDefault: {
      type: String,
      required: false,
    },

    totalEntries: {
      type: Number,
      required: false,
    },

    loading: {
      type: Boolean,
      required: false,
      default: false,
    },

    paginationable: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  emits: ['perPageSelectChanged', 'pageChanged'],

  data() {
    return {
      perPage: '',
      currentPage: 1,
    };
  },

  computed: {
    statusClass() {
      return (status: string) => {
        switch (status) {
          case 'up':
            return 'success-status';
          case 'unknown':
            return 'waiting-status';
          case 'down':
            return 'error-status';
          default:
            return 'waiting-status';
        }
      };
    },

    perPageComp: {
      get(): string {
        return this.perPage
          ? this.perPage
          : this.perPageDefault
            ? this.perPageDefault
            : this.perPageOptions[0].value;
      },

      set(value: string) {
        this.perPage = value;
      },
    },

    paginationPerPage() {
      return Number(this.perPageComp);
    },
  },

  methods: {
    perPageSelectHandler() {
      this.$emit('perPageSelectChanged', this.currentPage, this.perPageComp);
    },

    pageChangeHandler(page: number) {
      this.currentPage = page;
      this.$emit('pageChanged', this.currentPage, this.perPageComp);
    },
  },
});
</script>

<style lang="scss" scoped>
.cards-h-scroll {
  @apply relative overflow-auto whitespace-nowrap;
}
.wrapper {
  @apply bg-white shadow-basic border border-card-border-color rounded;
  flex: 1 1 auto;
}
</style>
