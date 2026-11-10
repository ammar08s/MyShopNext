export type DemoRole = "user" | "admin";

export type DemoSessionSnapshot = {
  warning: string | null;
} & (
  | { status: "loading" | "guest"; role: null }
  | { status: "signed-in"; role: DemoRole }
);

export interface DemoSessionStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

export interface DemoSessionStore {
  getSnapshot: () => DemoSessionSnapshot;
  getServerSnapshot: () => DemoSessionSnapshot;
  subscribe: (listener: () => void) => () => void;
  signIn: (role: DemoRole) => void;
  signOut: () => void;
}

export interface DemoSessionContextValue {
  session: DemoSessionSnapshot;
  signIn: (role: DemoRole) => void;
  signOut: () => void;
}
