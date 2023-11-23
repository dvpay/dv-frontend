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
        <ui-skeleton-box v-if="skeletonLoading" width="100%" height="167px" />
        <div v-else class="card">
            <div v-if="withdrawalWallet.id">
                <div>
                    <h2 class=" text-2xl font-semibold ">{{ $t('Where to send everything') }} <span class="uppercase">{{
                        withdrawalWallet.currency }} ({{ withdrawalWallet.chain }})</span> {{ $t('from Hot wallets') }}
                    </h2>
                    <div class="mt-2 gap">
                        <div class="form-group flex gap-6">
                            <label for="walletType" class="self-start min-w-400px">
                                {{ $t('Send all') }}
                            </label>
                            <ui-select class="w-500px h-38px" id="walletType" v-model="selectWalletType" :key="test"
                                @change="updateWithdrawalWalletData" :options="selectWalletTypeOptions" />
                            <div class="" v-if="selectWalletType == 3">
                                <p>{{ $t('Current installed wallet') }}</p>
                                <p> {{ withdrawalWallet.address.join(', ') }}</p>
                            </div>

                        </div>
                        <div class="form-group flex gap-6 mt-6" v-if="selectWalletType && selectWalletType == 2">
                            <label for="inputAddress" class="self-start min-w-400px">
                                {{ $t('Enter your withdrawal address') }}
                            </label>
                            <div>
                                <div v-for="(address, index) in addresses" :key="index">
                                    <ui-input required type="text" class="w-500px mb-3" v-model="addresses[index]" />
                                </div>
                                <div
                                    @click="addNewAddress"
                                    class="mt-1 flex justify-center px-1 pt-1 pb-1 border-2 border-gray-300 border-dashed rounded-md">
                                    <div class="space-y-1 text-center">
                                        <div class="flex text-sm text-gray-600 items-center justify-center">
                                            <span class="flex-shrink-0 h-10 w-10 inline-flex items-center justify-center">
                                                <!-- Heroicon name: solid/plus -->
                                                <svg class="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                    fill="currentColor" aria-hidden="true">
                                                    <path fill-rule="evenodd"
                                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </span>
                                            <span>{{ $t('Add additional address') }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="selectWalletType != 1" class="mt-6">
                    <h2 class=" text-2xl  font-semibold ">{{ $t('Accumulation Rules') }}</h2>
                    <div class="mt-2">
                        {{ $t('accumulation_rules_text') }}
                    </div>

                    <div class="form-group gap-6 mt-6">
                        <h2 class="self-start min-w-250px text-2xl  font-medium ">
                            {{ $t('Set forwarding rules') }} <span class="uppercase font-extrabold">{{
                                withdrawalWallet.blockchain
                            }} {{ withdrawalWallet.currency }} ({{ withdrawalWallet.chain }})</span>
                        </h2>
                        <div class="flex gap-6">
                            <ui-select class="w-400px h-38px mt-6" id="walletType" v-model="selectWithdrawalType"
                                :options="selectWithdrawalListType" @change="updateWithdrawalType" />

                            <ui-input v-if="selectWithdrawalType == 3" required type="number" class="w-300px h-32px mt-6"
                                v-model="updateWithdrawalWallet.withdrawalMinBalance" />

                            <ui-select v-if="selectWithdrawalType == 4" class="w-400px h-38px mt-6" id="walletType"
                                v-model="updateWithdrawalWallet.withdrawalInterval" :options="withdrawalIntervals" />
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-end mt-6">
                    <button class="button button-primary px-5 py-6px" @click="save">
                        {{ $t('Save') }}
                    </button>
                </div>
            </div>

            <div v-else>
                {{ $t('Wallet not found') }}
            </div>

        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import WithdrawalTab from '@/components/withdrawalWallet/WithdrawalTab.vue'
import { mapActions, mapState } from 'vuex';
import UiSkeletonBox from '@/components/ui/UiSkeletonBox.vue';
import UiSelect from '@/components/ui/UiSelect.vue';
import UiInput from '@/components/ui/UiInput.vue';

export default defineComponent({

    data() {
        return {
            skeletonLoading: false,
            addresses: [],
            updateWithdrawalWallet: {
                id: <String>'',
                withdrawalEnabled: <Boolean>false,
                exchangeSlug: <String | null>null,
                addressType: <String | null>'manual',
                withdrawalMinBalance: <Number>0,
                withdrawalInterval: <String>'',
                address: <Array<String>>[],
            },
            selectWalletType: 1,
            selectWithdrawalType: 1,
            test: 1,
            walletTypeList: [
                {
                    'id': 1,
                    'withdrawalEnabled': false,
                    'exchangeSlug': null,
                    'addressType': 'manual',
                },
                {
                    'id': 2,
                    'withdrawalEnabled': true,
                    'exchangeSlug': null,
                    'addressType': 'manual',
                },
                {
                    'id': 3,
                    'withdrawalEnabled': true,
                    'exchangeSlug': 'huobi',
                    'addressType': 'deposit',
                }
            ],
            withdrawalTypeList: [
                {
                    id: 1,
                    withdrawalMinBalance: 0,
                    withdrawalInterval: 'EveryOneMin',
                },
                {
                    id: 2,
                    withdrawalMinBalance: 0,
                    withdrawalInterval: 'Never',
                },
                {
                    id: 3,
                    withdrawalMinBalance: 0,
                    withdrawalInterval: 'EveryOneMin',
                },
                {
                    id: 4,
                    withdrawalMinBalance: 0,
                    withdrawalInterval: 'Never',
                },
            ],
            titleSendToExchange: this.$t('Send to exchange') + ' Huobi ',
        }
    },
    components: {
        WithdrawalTab,
        UiSkeletonBox,
        UiSelect,
        UiInput
    },

    computed: {
        ...mapState('withdrawal_wallet', {
            withdrawalWallet: 'withdrawalWallet',
            isWithdrawalWalletsLoaded: 'isWithdrawalWalletsLoaded',
            exchangeConnect: 'exchangeConnect',
            depositWallets: 'depositWallets',
        }),

        ...mapState('dictionaries', {
            exchanges: 'exchanges',
            withdrawalIntervals: 'withdrawalIntervals'
        }),

        walletId() {
            return this.$route.params.wallet_id;
        },

        depositWalletsAddress() {
            return this.depositWallets.find((item: { chain: any; }) => item.chain === this.withdrawalWallet.chain)
        },

        selectWalletTypeOptions() {
            return [
                {
                    title: this.$t('Never send'),
                    value: 1,
                },
                {
                    title: this.$t('Write Address Manual'),
                    value: 2,
                },
                {
                    title: this.depositWalletsAddress ? this.$t('Send to exchange') + ' Huobi ' + this.depositWalletsAddress?.address : this.$t('Send to exchange'),
                    value: 3,
                    disabled: !this.exchangeConnect,
                },
            ]
        },
        selectWithdrawalListType() {
            return [
                {
                    title: this.$t('Send as soon as funds are received'),
                    value: 1,
                },
                {
                    title: this.$t('Do not send automatically, I will send manually'),
                    value: 2,
                },
                {
                    title: this.$t('Send by accumulating amount'),
                    value: 3,
                },
                {
                    title: this.$t('Send on schedule'),
                    value: 4,
                }
            ];
        }
    },
    watch: {
        exchangeConnect: {
            handler: function (newValue) {
                if (this.exchangeConnect) {
                    this.loadDepositWallets({ exchange: 'huobi' })
                }
            },
            deep: true
        }
    },

    methods: {
        ...mapActions('withdrawal_wallet', [
            'loadWithdrawalWallet',
            'loadDepositWallets',
            'updateWithdrawalWalletHandeler'
        ]),

        updateWithdrawalWalletData(value: number) {
            const select = this.walletTypeList.find((item) => item.id == value)
            if (select) {
                this.addresses = [];
                this.updateWithdrawalWallet.withdrawalEnabled = select.withdrawalEnabled
                this.updateWithdrawalWallet.exchangeSlug = select.exchangeSlug
                this.updateWithdrawalWallet.addressType = select.addressType
                this.updateWithdrawalWallet.address = select.id === 3 ? this.depositWalletsAddress.address : this.updateWithdrawalWallet.address
                this.addresses = select.id === 3 ? [this.depositWalletsAddress.address] : this.updateWithdrawalWallet.address
            }
        },
        updateWithdrawalType(value: number) {
            const select = this.withdrawalTypeList.find((item) => item.id == value)
            if (select) {
                this.updateWithdrawalWallet.withdrawalMinBalance = select.withdrawalMinBalance;
                this.updateWithdrawalWallet.withdrawalInterval = select.withdrawalInterval;
            }
        },
        addNewAddress() {
            this.addresses.push('')
        },

        async setData() {
            this.updateWithdrawalWallet.id = this.withdrawalWallet.id
            this.updateWithdrawalWallet.withdrawalEnabled = this.withdrawalWallet.withdrawalEnabled
            this.updateWithdrawalWallet.withdrawalMinBalance = this.withdrawalWallet.withdrawalMinBalance
            this.updateWithdrawalWallet.withdrawalInterval = this.withdrawalWallet.withdrawalInterval
            this.addresses = this.withdrawalWallet.address
            this.setSelectWithdrawalType()
            if (!this.withdrawalWallet.withdrawalEnabled) {
                this.selectWalletType = 1
                return;
            }
            if (this.withdrawalWallet.type === 'manual') {
                this.selectWalletType = 2
                return;
            }
            if (this.withdrawalWallet.exchange && this.withdrawalWallet.type === 'deposit') {
                this.selectWalletType = 3
                return;
            }
        },
        setSelectWithdrawalType() {
            if (this.withdrawalWallet.withdrawalMinBalance === 0 && this.withdrawalWallet.withdrawalInterval === 'EveryOneMin') {
                this.selectWithdrawalType = 1;
                return;
            }
            if (this.withdrawalWallet.withdrawalMinBalance === 0 && this.withdrawalWallet.withdrawalInterval === 'Never') {
                this.selectWithdrawalType = 2;
                return;
            }
            if (this.withdrawalWallet.withdrawalMinBalance !== 0) {
                this.selectWithdrawalType = 3;
                return;
            }
            if (this.withdrawalWallet.withdrawalInterval !== 'Never') {
                this.selectWithdrawalType = 4;
                return;
            }
        },

        async save() {
            this.updateWithdrawalWallet.address = this.addresses.filter(item => item !== "")
            try {
                await this.updateWithdrawalWalletHandeler(this.updateWithdrawalWallet);
                this.$toast.success(this.$t('Exchange settings successfully updated'));
                this.loadData()
            } catch { }
        },


        async loadData() {
            try {
                if (!this.isWithdrawalWalletsLoaded) {
                    this.skeletonLoading = true;
                }
                if (this.isWithdrawalWalletsLoaded) {
                    this.$store.commit('app/setProgressBar', 'stop');
                }
                await this.loadWithdrawalWallet(this.walletId);

                this.$store.commit('app/setProgressBar', 'stop');
                this.skeletonLoading = false;
            } catch (e) {
                this.$store.commit('app/setProgressBar', 'stop');
                this.skeletonLoading = false;
            }

            if (this.exchangeConnect) {
                this.loadDepositWallets({ exchange: 'huobi' })
            }

        },
    },

    async created() {
        await this.loadData()
        await this.setData()
    },
})
</script>
