<template>
  <svg
    :width="size"
    :height="size"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
  >
    <g transform="rotate(178.548 50 50)">
      <path
        fill="none"
        :stroke="colorCase"
        stroke-width="5"
        stroke-miterlimit="10"
        d="M58.4,51.7c-0.9-0.9-1.4-2-1.4-2.3s0.5-0.4,1.4-1.4 C70.8,43.8,79.8,30.5,80,15.5H70H30H20c0.2,15,9.2,28.1,21.6,32.3c0.9,0.9,1.4,1.2,1.4,1.5s-0.5,1.6-1.4,2.5 C29.2,56.1,20.2,69.5,20,85.5h10h40h10C79.8,69.5,70.8,55.9,58.4,51.7z"
      />
      <clipPath id="uil-hourglass-clip1">
        <rect x="15" y="44.9395" width="70" height="0.0604839">
          <animate
            attributeName="height"
            from="25"
            to="0"
            dur="2s"
            repeatCount="indefinite"
            values="25;0;0"
            keyTimes="0;0.5;1"
          />
          <animate
            attributeName="y"
            from="20"
            to="45"
            dur="2s"
            repeatCount="indefinite"
            values="20;45;45"
            keyTimes="0;0.5;1"
          />
        </rect>
      </clipPath>
      <clipPath id="uil-hourglass-clip2">
        <rect x="15" y="55.0605" width="70" height="24.9395">
          <animate
            attributeName="height"
            from="0"
            to="25"
            dur="2s"
            repeatCount="indefinite"
            values="0;25;25"
            keyTimes="0;0.5;1"
          />
          <animate
            attributeName="y"
            from="80"
            to="55"
            dur="2s"
            repeatCount="indefinite"
            values="80;55;55"
            keyTimes="0;0.5;1"
          />
        </rect>
      </clipPath>
      <path
        d="M29,23c3.1,11.4,11.3,19.5,21,19.5S67.9,34.4,71,23H29z"
        clip-path="url(#uil-hourglass-clip1)"
        :fill="colorSand"
      />
      <path
        d="M71.6,78c-3-11.6-11.5-20-21.5-20s-18.5,8.4-21.5,20H71.6z"
        clip-path="url(#uil-hourglass-clip2)"
        :fill="colorSand"
      />
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 50 50"
        to="180 50 50"
        repeatCount="indefinite"
        dur="2s"
        values="0 50 50;0 50 50;180 50 50"
        keyTimes="0;0.7;1"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    size: {
      type: String,
      default: '50px',
    },

    colorSand: {
      type: String,
      default: '#ffab00',
    },

    colorCase: {
      type: String,
      default: '#4660F6',
    },
  },
});
</script>
