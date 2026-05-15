export const contextTemplate = `import { createContext, useContext } from '@emberkit/core';

interface {{name}}Context {
  // Define your context shape
  value: string;
}

const {{name}}Context = createContext<{{name}}Context>({
  value: 'default',
});

// Provider usage:
// <{{name}}Context.Provider value={{ value: 'hello' }}>
//   {children}
// </{{name}}Context.Provider>

// Consumer usage:
// const ctx = useContext({{name}}Context);

export { {{name}}Context };
`;