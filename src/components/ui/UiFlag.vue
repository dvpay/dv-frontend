<template>
  <div
    class="e-flag"
    :class="{ ['e-flag--rounded']: rounded }"
  >
    <div
      class="e-flag--wrapper"
    >
      <img
        class="e-flag__img"
        :class="[
          isoCode.toLowerCase(),
        ]"
        src="@/assets/img/flags/flag-placeholder.png"
        :alt="isoCode"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    isoCode: {
      type: String,
      required: true,
    },
    rounded: {
      type: Boolean,
    },
  },
});
</script>

<style scoped lang="scss">
.e-flag {
  margin: 2px 0;
  position: relative;
  overflow: hidden;
  width: 22px;
  min-width: 22px;
  height: 15px;
  border: 1px solid #999999;
  border-radius: 2px;

  &--rounded {
    width: 20px;
    height: 20px;
    min-width: 20px;
    border-radius: 100%;
  }

  &--wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    width: 22px;
    height: 15px;
  }
}
.e-flag__img.ru {
  background-position: 0 75.206612%;
}

.e-flag__img {
  background: url('@/assets/img/flags/flags-responsive.png') no-repeat;
  background-size: 100%;
  &.ad {
    background-position: 0 .413223%;
  }
  &.ae {
    background-position: 0 .826446%;
  }
  &.af {
    background-position: 0 1.239669%;
  }
  &.ag {
    background-position: 0 1.652893%;
  }
  &.ai {
    background-position: 0 2.066116%;
  }
  &.al {
    background-position: 0 2.479339%;
  }
  &.am {
    background-position: 0 2.892562%;
  }
  &.an {
    background-position: 0 3.305785%;
  }
  &.ao {
    background-position: 0 3.719008%;
  }
  &.aq {
    background-position: 0 4.132231%;
  }
  &.ar {
    background-position: 0 4.545455%;
  }
  &.as {
    background-position: 0 4.958678%;
  }
  &.at {
    background-position: 0 5.371901%;
  }
  &.au {
    background-position: 0 5.785124%;
  }
  &.aw {
    background-position: 0 6.198347%;
  }
  &.az {
    background-position: 0 6.61157%;
  }
  &.ba {
    background-position: 0 7.024793%;
  }
  &.bb {
    background-position: 0 7.438017%;
  }
  &.bd {
    background-position: 0 7.85124%;
  }
  &.be {
    background-position: 0 8.264463%;
  }
  &.bf {
    background-position: 0 8.677686%;
  }
  &.bg {
    background-position: 0 9.090909%;
  }
  &.bh {
    background-position: 0 9.504132%;
  }
  &.bi {
    background-position: 0 9.917355%;
  }
  &.bj {
    background-position: 0 10.330579%;
  }
  &.bm {
    background-position: 0 10.743802%;
  }
  &.bn {
    background-position: 0 11.157025%;
  }
  &.bo {
    background-position: 0 11.570248%;
  }
  &.br {
    background-position: 0 11.983471%;
  }
  &.bs {
    background-position: 0 12.396694%;
  }
  &.bt {
    background-position: 0 12.809917%;
  }
  &.bv {
    background-position: 0 13.22314%;
  }
  &.bw {
    background-position: 0 13.636364%;
  }
  &.by {
    background-position: 0 14.049587%;
  }
  &.bz {
    background-position: 0 14.46281%;
  }
  &.ca {
    background-position: 0 14.876033%;
  }
  &.cc {
    background-position: 0 15.289256%;
  }
  &.cd {
    background-position: 0 15.702479%;
  }
  &.cf {
    background-position: 0 16.115702%;
  }
  &.cg {
    background-position: 0 16.528926%;
  }
  &.ch {
    background-position: 0 16.942149%;
  }
  &.ci {
    background-position: 0 17.355372%;
  }
  &.ck {
    background-position: 0 17.768595%;
  }
  &.cl {
    background-position: 0 18.181818%;
  }
  &.cm {
    background-position: 0 18.595041%;
  }
  &.cn {
    background-position: 0 19.008264%;
  }
  &.zh {
    background-position: 0 19.008264%;
  }
  &.co {
    background-position: 0 19.421488%;
  }
  &.cr {
    background-position: 0 19.834711%;
  }
  &.cu {
    background-position: 0 20.247934%;
  }
  &.cv {
    background-position: 0 20.661157%;
  }
  &.cx {
    background-position: 0 21.07438%;
  }
  &.cy {
    background-position: 0 21.487603%;
  }
  &.cz {
    background-position: 0 21.900826%;
  }
  &.cs {
    background-position: 0 21.900826%;
  }
  &.de {
    background-position: 0 22.31405%;
  }
  &.dj {
    background-position: 0 22.727273%;
  }
  &.dk {
    background-position: 0 23.140496%;
  }
  &.dm {
    background-position: 0 23.553719%;
  }
  &.do {
    background-position: 0 23.966942%;
  }
  &.dz {
    background-position: 0 24.380165%;
  }
  &.ec {
    background-position: 0 24.793388%;
  }
  &.ee {
    background-position: 0 25.206612%;
  }
  &.eg {
    background-position: 0 25.619835%;
  }
  &.eh {
    background-position: 0 26.033058%;
  }
  &.er {
    background-position: 0 26.446281%;
  }
  &.es {
    background-position: 0 26.859504%;
  }
  &.et {
    background-position: 0 27.272727%;
  }
  &.fi {
    background-position: 0 27.68595%;
  }
  &.fj {
    background-position: 0 28.099174%;
  }
  &.fk {
    background-position: 0 28.512397%;
  }
  &.fm {
    background-position: 0 28.92562%;
  }
  &.fo {
    background-position: 0 29.338843%;
  }
  &.fr {
    background-position: 0 29.752066%;
  }
  &.ga {
    background-position: 0 30.165289%;
  }
  &.gd {
    background-position: 0 30.578512%;
  }
  &.ge {
    background-position: 0 30.991736%;
  }
  &.gf {
    background-position: 0 31.404959%;
  }
  &.gh {
    background-position: 0 31.818182%;
  }
  &.gi {
    background-position: 0 32.231405%;
  }
  &.gl {
    background-position: 0 32.644628%;
  }
  &.gm {
    background-position: 0 33.057851%;
  }
  &.gn {
    background-position: 0 33.471074%;
  }
  &.gp {
    background-position: 0 33.884298%;
  }
  &.gq {
    background-position: 0 34.297521%;
  }
  &.gr {
    background-position: 0 34.710744%;
  }
  &.gs {
    background-position: 0 35.123967%;
  }
  &.gt {
    background-position: 0 35.53719%;
  }
  &.gu {
    background-position: 0 35.950413%;
  }
  &.gw {
    background-position: 0 36.363636%;
  }
  &.gy {
    background-position: 0 36.77686%;
  }
  &.hk {
    background-position: 0 37.190083%;
  }
  &.hm {
    background-position: 0 37.603306%;
  }
  &.hn {
    background-position: 0 38.016529%;
  }
  &.hr {
    background-position: 0 38.429752%;
  }
  &.ht {
    background-position: 0 38.842975%;
  }
  &.hu {
    background-position: 0 39.256198%;
  }
  &.id {
    background-position: 0 39.669421%;
  }
  &.ie {
    background-position: 0 40.082645%;
  }
  &.il {
    background-position: 0 40.495868%;
  }
  &.in, &.hi {
    background-position: 0 40.909091%;
  }
  &.io {
    background-position: 0 41.322314%;
  }
  &.iq {
    background-position: 0 41.735537%;
  }
  &.ir {
    background-position: 0 42.14876%;
  }
  &.is {
    background-position: 0 42.561983%;
  }
  &.it {
    background-position: 0 42.975207%;
  }
  &.jm {
    background-position: 0 43.38843%;
  }
  &.jo {
    background-position: 0 43.801653%;
  }
  &.jp {
    background-position: 0 44.214876%;
  }
  &.ke {
    background-position: 0 44.628099%;
  }
  &.kg {
    background-position: 0 45.041322%;
  }
  &.kh {
    background-position: 0 45.454545%;
  }
  &.ki {
    background-position: 0 45.867769%;
  }
  &.km {
    background-position: 0 46.280992%;
  }
  &.kn {
    background-position: 0 46.694215%;
  }
  &.kp {
    background-position: 0 47.107438%;
  }
  &.kr {
    background-position: 0 47.520661%;
  }
  &.kw {
    background-position: 0 47.933884%;
  }
  &.ky {
    background-position: 0 48.347107%;
  }
  &.kz {
    background-position: 0 48.760331%;
  }
  &.la {
    background-position: 0 49.173554%;
  }
  &.lb {
    background-position: 0 49.586777%;
  }
  &.lc {
    background-position: 0 50%;
  }
  &.li {
    background-position: 0 50.413223%;
  }
  &.lk {
    background-position: 0 50.826446%;
  }
  &.lr {
    background-position: 0 51.239669%;
  }
  &.ls {
    background-position: 0 51.652893%;
  }
  &.lt {
    background-position: 0 52.066116%;
  }
  &.lu {
    background-position: 0 52.479339%;
  }
  &.lv {
    background-position: 0 52.892562%;
  }
  &.ly {
    background-position: 0 53.305785%;
  }
  &.ma {
    background-position: 0 53.719008%;
  }
  &.mc {
    background-position: 0 54.132231%;
  }
  &.md {
    background-position: 0 54.545455%;
  }
  &.me {
    background-position: 0 54.958678%;
  }
  &.mg {
    background-position: 0 55.371901%;
  }
  &.mh {
    background-position: 0 55.785124%;
  }
  &.mk {
    background-position: 0 56.198347%;
  }
  &.ml {
    background-position: 0 56.61157%;
  }
  &.mm {
    background-position: 0 57.024793%;
  }
  &.mn {
    background-position: 0 57.438017%;
  }
  &.mo {
    background-position: 0 57.85124%;
  }
  &.mp {
    background-position: 0 58.264463%;
  }
  &.mq {
    background-position: 0 58.677686%;
  }
  &.mr {
    background-position: 0 59.090909%;
  }
  &.ms {
    background-position: 0 59.504132%;
  }
  &.mt {
    background-position: 0 59.917355%;
  }
  &.mu {
    background-position: 0 60.330579%;
  }
  &.mv {
    background-position: 0 60.743802%;
  }
  &.mw {
    background-position: 0 61.157025%;
  }
  &.mx {
    background-position: 0 61.570248%;
  }
  &.my {
    background-position: 0 61.983471%;
  }
  &.mz {
    background-position: 0 62.396694%;
  }
  &.na {
    background-position: 0 62.809917%;
  }
  &.nc {
    background-position: 0 63.22314%;
  }
  &.ne {
    background-position: 0 63.636364%;
  }
  &.nf {
    background-position: 0 64.049587%;
  }
  &.ng {
    background-position: 0 64.46281%;
  }
  &.ni {
    background-position: 0 64.876033%;
  }
  &.nl {
    background-position: 0 65.289256%;
  }
  &.no {
    background-position: 0 65.702479%;
  }
  &.np {
    background-position: 0 66.115702%;
  }
  &.nr {
    background-position: 0 66.528926%;
  }
  &.nu {
    background-position: 0 66.942149%;
  }
  &.nz {
    background-position: 0 67.355372%;
  }
  &.om {
    background-position: 0 67.768595%;
  }
  &.pa {
    background-position: 0 68.181818%;
  }
  &.pe {
    background-position: 0 68.595041%;
  }
  &.pf {
    background-position: 0 69.008264%;
  }
  &.pg {
    background-position: 0 69.421488%;
  }
  &.ph {
    background-position: 0 69.834711%;
  }
  &.pk {
    background-position: 0 70.247934%;
  }
  &.pl {
    background-position: 0 70.661157%;
  }
  &.pm {
    background-position: 0 71.07438%;
  }
  &.pn {
    background-position: 0 71.487603%;
  }
  &.pr {
    background-position: 0 71.900826%;
  }
  &.pt {
    background-position: 0 72.31405%;
  }
  &.pw {
    background-position: 0 72.727273%;
  }
  &.py {
    background-position: 0 73.140496%;
  }
  &.qa {
    background-position: 0 73.553719%;
  }
  &.re {
    background-position: 0 73.966942%;
  }
  &.ro {
    background-position: 0 74.380165%;
  }
  &.rs {
    background-position: 0 74.793388%;
  }
  &.rw {
    background-position: 0 75.619835%;
  }
  &.sa {
    background-position: 0 76.033058%;
  }
  &.sb {
    background-position: 0 76.446281%;
  }
  &.sc {
    background-position: 0 76.859504%;
  }
  &.sd {
    background-position: 0 77.272727%;
  }
  &.se {
    background-position: 0 77.68595%;
  }
  &.sg {
    background-position: 0 78.099174%;
  }
  &.sh {
    background-position: 0 78.512397%;
  }
  &.si {
    background-position: 0 78.92562%;
  }
  &.sj {
    background-position: 0 79.338843%;
  }
  &.sk {
    background-position: 0 79.752066%;
  }
  &.sl {
    background-position: 0 80.165289%;
  }
  &.sm {
    background-position: 0 80.578512%;
  }
  &.sn {
    background-position: 0 80.991736%;
  }
  &.so {
    background-position: 0 81.404959%;
  }
  &.sr {
    background-position: 0 81.818182%;
  }
  &.ss {
    background-position: 0 82.231405%;
  }
  &.st {
    background-position: 0 82.644628%;
  }
  &.sv {
    background-position: 0 83.057851%;
  }
  &.sy {
    background-position: 0 83.471074%;
  }
  &.sz {
    background-position: 0 83.884298%;
  }
  &.tc {
    background-position: 0 84.297521%;
  }
  &.td {
    background-position: 0 84.710744%;
  }
  &.tf {
    background-position: 0 85.123967%;
  }
  &.tg {
    background-position: 0 85.53719%;
  }
  &.th {
    background-position: 0 85.950413%;
  }
  &.tj {
    background-position: 0 86.363636%;
  }
  &.tk {
    background-position: 0 86.77686%;
  }
  &.tl {
    background-position: 0 87.190083%;
  }
  &.tm {
    background-position: 0 87.603306%;
  }
  &.tn {
    background-position: 0 88.016529%;
  }
  &.to {
    background-position: 0 88.429752%;
  }
  &.tp {
    background-position: 0 88.842975%;
  }
  &.tr {
    background-position: 0 89.256198%;
  }
  &.tt {
    background-position: 0 89.669421%;
  }
  &.tv {
    background-position: 0 90.082645%;
  }
  &.tw {
    background-position: 0 90.495868%;
  }
  &.ty {
    background-position: 0 90.909091%;
  }
  &.tz {
    background-position: 0 91.322314%;
  }
  &.ua {
    background-position: 0 91.735537%;
  }
  &.ug {
    background-position: 0 92.14876%;
  }
  &.gb, &.uk, &.en {
    background-position: 0 92.561983%;
  }
  &.um {
    background-position: 0 92.975207%;
  }
  &.us {
    background-position: 0 93.38843%;
  }
  &.uy {
    background-position: 0 93.801653%;
  }
  &.uz {
    background-position: 0 94.214876%;
  }
  &.va {
    background-position: 0 94.628099%;
  }
  &.vc {
    background-position: 0 95.041322%;
  }
  &.ve {
    background-position: 0 95.454545%;
  }
  &.vg {
    background-position: 0 95.867769%;
  }
  &.vi {
    background-position: 0 96.280992%;
  }
  &.vn {
    background-position: 0 96.694215%;
  }
  &.vu {
    background-position: 0 97.107438%;
  }
  &.wf {
    background-position: 0 97.520661%;
  }
  &.ws {
    background-position: 0 97.933884%;
  }
  &.ye {
    background-position: 0 98.347107%;
  }
  &.za {
    background-position: 0 98.760331%;
  }
  &.zm {
    background-position: 0 99.173554%;
  }
  &.zr {
    background-position: 0 99.586777%;
  }
  &.zw {
    background-position: 0 100%;
  }
}
</style>
