<template>
    <div>
        <div class="mb-6">
            <div class="flex items-center justify-between gap-2">
                <div class="page-title">
                    {{ $t('Withdrawal Rules from hot wallets') }}
                </div>
            </div>
        </div>
        <div class="mb-8 relative">
            <withdrawal-tab />
        </div>
        <div class="card" v-if="!exchangeConnect && !connectNewExchange">
            <h2 class=" text-2xl font-semibold ">{{ $t('You do not have connected exchanges') }}</h2>
            <p>{{ $t('If you connect the exchange, you can') }}</p>
            <p>- {{ $t('Send all funds to the exchange automatically') }}</p>
            <p class="underline">- {{ $t('Enable auto-exchange') }}</p>
            <p>- {{ $t('And even automatic withdrawal of exchanged funds to a cold wallet') }}</p>
            <button class="button button-primary px-5 mt-8 py-6px" @click="connectNewExchange = !connectNewExchange">
                {{ $t('Connect') }}
            </button>
        </div>
        <div class="card" v-if="exchangeConnect || connectNewExchange">
            <label for="walletType" class="self-start">
                {{ $t('Select exchange') }}
            </label>
            <ui-select class="w-400px h-38px mt-2" id="walletType" v-model="selectExchange" :options="exchangeList"
                @change="syncDataFromVuex" />
            <form v-if="selectExchange" @submit.prevent="connectHandler(exchangeConnect ? 'loadAddress' : 'testConnect')" class="mt-8">
                <div class="flex flex-col gap-4 mb-6">
                    <div v-for="(key, i) in currentExchangeValue.keys" :key="i"
                        class="grid gap-2 grid-cols-[150px,1fr] items-center">
                        <label>{{ key.title }}</label>
                        <ui-input required type="text" v-model="key.value" />
                    </div>
                </div>
                <div class="flex items-center justify-between" v-if="selectExchange">

                    <div class="text-lg" v-if="isLoadWallets">
                        {{ $t('success_load_address') }}
                    </div>
                    <div></div>
                    <ui-button-loading class="button button-primary px-4 py-2" :loading="connectBtnLoading"
                        >
                        {{ exchangeConnect ? $t('Update address') : $t('Connect') }}
                    </ui-button-loading>
                </div>

            </form>
        </div>
        <div v-if="walletsLoading && !isWalletsLoaded" class="grid gap-6 grid-cols-[1fr,1fr]">
            <ui-skeleton-box v-for="i in 2" :key="i" width="100%" height="100px" />
        </div>
        <div v-else class="flex gap-6 mt-8 flex-wrap">
            <deposit-wallets :title="$t('Depostit Title')" />
            <withdrawal-wallets />
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WithdrawalTab from '@/components/withdrawalWallet/WithdrawalTab.vue'
import { mapActions, mapState } from 'vuex';
import UiSelect from '@/components/ui/UiSelect.vue';
import ExchangeSettings from '@/components/exchanges/ExchangeSettings.vue';
import { UserExchangesResponse } from '@/services/ExchangesService/types';
import UiInput from '@/components/ui/UiInput.vue';
import UiButtonLoading from '@/components/ui/UiButtonLoading.vue';
import DepositWallets from '@/components/exchanges/DepositWallets.vue';
import WithdrawalWallets from '@/components/exchanges/WithdrawalWallets.vue';

export default defineComponent({
    components: {
        WithdrawalTab,
        UiSelect,
        UiInput,
        UiButtonLoading,
        ExchangeSettings,
        DepositWallets,
        WithdrawalWallets
    },
    computed: {
        ...mapState('withdrawal_wallet', {
            exchangeConnect: 'exchangeConnect',
        }),
        ...mapState('dictionaries', {
            exchanges: 'exchanges'
        }),
        ...mapState('exchanges', {
            listOfExchanges: 'listOfExchanges',
            isWalletsLoaded: 'isWalletsLoaded',
            walletsLoading: 'walletsLoading',
        }),

        exchangeList(): any {
            return this.exchanges.map((item: { name: any; slug: any; }) => ({ title: item.name, value: item.slug }))
        },

    },
    data() {
        return {
            connectNewExchange: false,
            selectExchange: '',
            currentExchangeValue: {} as UserExchangesResponse,
            isExchangeKeysExist: false,
            connectBtnLoading: false,
            isLoadWallets: false,
        }
    },

    methods: {
        ...mapActions('exchanges', [
            'loadListOfExchanges',
            'updateExchangeKeys',
            'testExchange',
            'connect',
            'loadWallets',
        ]),
        syncDataFromVuex() {
            this.currentExchangeValue = [...this.listOfExchanges]
                .filter((item: UserExchangesResponse) => item.exchange.toLowerCase() === this.selectExchange)[0];


            if (this.currentExchangeValue) {
                this.isExchangeKeysExist = this.currentExchangeValue.keys
                    .reduce((acc: boolean, curr: { name: string, title: string, value: string }) => {
                        if (curr.name === 'accessKey' && curr.value) {
                            return true;
                        }
                        return acc;
                    }, false);
            }
        },
        async connectHandler(type: string) {
            try {
                this.connectBtnLoading = true;

                const payload = {
                    ...this.currentExchangeValue,
                    keys: this.currentExchangeValue.keys.map((item) => ({
                        name: item.name,
                        value: item.value,
                    })),
                };
                await this.connect(payload);
                this.connectBtnLoading = false;
                this.$store.commit('withdrawal_wallet/setExchangeConnect', true)
                if (type !== 'loadAddress') {
                    this.$toast.success(this.$t('Connection success'));
                }
                this.isLoadWallets = true
            } catch (e) {
                this.connectBtnLoading = false;
                this.isLoadWallets = false

            }
        },

        async loadData() {
            try {
                await this.loadListOfExchanges();

                if (this.isExchangeKeysExist) {
                    await this.loadWallets({
                        exchange: this.selectExchange,
                    });
                }

                this.$store.commit('app/setProgressBar', 'stop');
            } catch (e) {
                this.$store.commit('app/setProgressBar', 'stop');
            }
        },
    },
    created() {
        this.loadData();
    }
});
</script>
