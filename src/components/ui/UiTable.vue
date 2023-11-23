<template>
  <div>
    <div class="table-h-scroll">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th
              v-for="( column, i ) in columns"
              :key="i"
              class="text-gray-600 font-500 uppercase py-4 px-3 align-top text-12px"
              :class="column.textAlign"
            >
              {{  column.label ? $t(column.label): '' }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in data" :key="i"
            class="border-b border-gray-200"
          >
            <td
              v-for="(column, i) in columns" :key="i"
              class="py-4 px-3"
              :class="column.textAlign"
            >
              <slot :name="'cell-' + column.field" :row="item">
                {{ item[column.field] }}
              </slot>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <slot name="tfoot"></slot>
        </tfoot>
      </table>
      <ui-loading :loading="loading" />
    </div>
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
    columns: {
      type: Array,
      required: true,
    },

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
.table-h-scroll {
  @apply relative overflow-auto whitespace-nowrap;
}
</style>
