import { defineStore } from "pinia";

type MessageType = "confirm" | "error";

interface ToastParams {
  text: string;
  type?: MessageType;
  timeout?: number;
}

interface Message {
  readonly text: string;
  readonly type: MessageType;
  readonly key: number;
}

interface ToastStore {
  readonly messages: readonly Message[];
  readonly toast: (params: ToastParams) => void;
}

type UseToastStore = () => ToastStore;

const useStore = defineStore("toast", {
  state: () => ({
    messages: [] as Array<Message>,
    key: 0,
  }),
  actions: {
    toast(params: ToastParams) {
      const m = {
        text: params.text,
        type: params.type || "confirm",
        key: (this.key += 1),
      };
      this.messages.push(m);
      setTimeout(() => {
        const index = this.messages.indexOf(m);
        if (index !== -1) {
          this.messages.splice(index, 1);
        }
      }, params.timeout || 3000);
    },
  },
});

export const useToast = useStore as UseToastStore;
