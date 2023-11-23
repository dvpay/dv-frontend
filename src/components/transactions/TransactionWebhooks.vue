<template>
  <div
    v-if="transactionWebhooks.length"
    class="card"
  >
    <div class="card-title mb-4">
      {{ $t('Related Webhooks') }}
    </div>
    <div class="h-scroll">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <template v-for="(column, i) in tableColumns" :key="i">
              <th
                class="text-gray-600 font-500 uppercase py-4 px-3 align-top text-12px"
                :class="[column.textAlign,
                  {
                    'request-col': column.field === 'request',
                    'response-col': column.field === 'response',
                  }
                ]"
              >
                <div>{{ $t(column.label) }}</div>
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, i) in transactionWebhooks" :key="i">
            <tr class="border-b border-gray-200">
              <template v-for="(column, j) in tableColumns" :key="j">
                <td
                  class="py-4 px-3"
                  :class="[column.textAlign,
                    {
                      'request-col': column.field === 'request',
                      'response-col': column.field === 'response',
                    }
                  ]"
                >
                  <template v-if="column.field === 'url'">
                    <div class="break-all">
                      {{ item.url }}
                    </div>
                  </template>
                  <template v-else-if="column.field === 'request'">
                    <div
                      aria-hidden="true"
                      @click="showHideRequests(i)"
                    >
                      <span
                        v-if="!requestsArray[i]"
                        class="link"
                      >
                        {{ $t('Show') }}
                      </span>
                      <span
                        v-else
                        class="link"
                      >
                        {{ $t('Hide') }}
                      </span>
                    </div>
                    <pre
                      v-if="requestsArray[i]"
                      class="pre text-left"
                    >{{ JSON.parse(item.request, null, 2) }}</pre>
                  </template>
                  <template v-else-if="column.field === 'response'">
                    <div
                      aria-hidden="true"
                      @click="showHideResponses(i)"
                    >
                      <span
                        v-if="!responseArray[i]"
                        class="link"
                      >
                        {{ $t('Show') }}
                      </span>
                      <span
                        v-else
                        class="link"
                      >
                        {{ $t('Hide') }}
                      </span>
                    </div>
                    <pre
                      v-if="responseArray[i]"
                      class="pre text-left"
                    >{{ JSON.parse(item.response, null, 2) }}</pre>
                  </template>
                  <template v-else>
                    {{ item[column.field] }}
                  </template>
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  data() {
    return {
      tableColumns: [
        {
          label: 'Url',
          field: 'url',
          textAlign: 'text-left',
        },
        {
          label: 'Created At',
          field: 'createdAt',
          textAlign: 'text-left',
        },
        {
          label: 'Status Code',
          field: 'statusCode',
          textAlign: 'text-center',
        },
        {
          label: 'Request',
          field: 'request',
          textAlign: 'text-center',
        },
        {
          label: 'Response',
          field: 'response',
          textAlign: 'text-center',
        },
      ],
      requestsArray: [] as boolean[],
      responseArray: [] as boolean[],
    };
  },

  computed: {
    ...mapGetters('transactions', {
      transactionWebhooks: 'getTransactionWebhooks',
    }),
  },

  watch: {
    transactionWebhooks() {
      this.requestsArray = Array(this.transactionWebhooks.length).fill(false);
      this.responseArray = Array(this.transactionWebhooks.length).fill(false);
    },
  },

  methods: {
    showHideRequests(index: number) {
      this.requestsArray = this.requestsArray
        .map((item, i) => (index === i ? !this.requestsArray[i] : this.requestsArray[i]));
    },

    showHideResponses(index: number) {
      this.responseArray = this.responseArray
        .map((item, i) => (index === i ? !this.responseArray[i] : this.responseArray[i]));
    },
  },
});
</script>

<style lang="scss" scoped>
.pre {
  @apply tab-2 whitespace-pre-wrap break-all text-xs border border-gray-200 rounded-sm p-2 font-400;
}

.request-col {
  width: 460px;
  min-width: 460px;
  max-width: 460px;
  left: 0;
}

.response-col {
  width: 400px;
  min-width: 400px;
  max-width: 400px;
  left: 0;
}
</style>
