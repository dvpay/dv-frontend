import useClipboard from 'vue-clipboard3';

const { toClipboard } = useClipboard();

interface Clibboard {
  toClipboard: typeof toClipboard;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $copyText: Clibboard;
  }
}
