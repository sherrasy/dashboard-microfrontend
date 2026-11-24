declare module 'catalog/App' {
  const App: import('react').ComponentType;
  export default App;
}

declare module 'cart/App' {
  const App: import('react').ComponentType;
  export default App;
}

// Виртуальный модуль @originjs/vite-plugin-federation: API для
// переключения remote на fallback URL в рантайме.
declare module 'virtual:__federation__' {
  export function __federation_method_setRemote(
    remoteName: string,
    remoteObj: { url: string; format: string; from: string },
  ): void;
  export function __federation_method_getRemote(
    remoteName: string,
    exposedComponent: string,
  ): Promise<unknown>;
}
