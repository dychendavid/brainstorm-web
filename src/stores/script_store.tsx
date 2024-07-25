import { create } from "zustand";
import Cookies from "js-cookie";
import questions from "@public/questions.json";

export type WizardAnswerProps = {
  name?: string;
  usage?: string;
  targetAudience?: string;
  difference?: string;
  highlight?: string;
  style?: string;
  guidance?: string;
  competitor?: string;
  length?: string;
  extra?: string;
};
export type AnswerKey = keyof WizardAnswerProps;

export type Question = {
  desc: string;
  placeholder?: string;
  key: AnswerKey;
};

const script: Array<Question> = questions as Array<Question>;

type ScriptStore = {
  currentIndex: number;
  script: Array<Question>;
  data: WizardAnswerProps;
  isLoadedFromCookie: boolean;
  isScriptLoaded: boolean;
  restart(): void;
  next(): void;
  back(): void;
  isLast(): boolean;
  getQuestion(): Question;

  getAnswer(): string;
  getAnswers(): WizardAnswerProps;
  setAnswer(key: AnswerKey, value: string): void;

  loadFromCookies: () => void;
  _backupToCookie: (key: string, value: string) => void;
};

const PREFIX = "script_store";

const useScriptStore = create<ScriptStore>((set, get) => ({
  currentIndex: 0,
  isLoadedFromCookie: false,
  isScriptLoaded: true,
  data: {},
  script: script,
  restart: () => {
    set({
      currentIndex: 0,
      isLoadedFromCookie: false,
    });
  },
  next() {
    set({
      currentIndex: get().currentIndex + 1,
    });
  },
  back() {
    set({
      currentIndex: get().currentIndex - 1,
    });
  },
  isLast() {
    const state = get();
    return state.currentIndex + 1 === state.script.length;
  },
  getQuestion() {
    const state = get();
    const currentIndex = state.currentIndex;
    return state.script[currentIndex];
  },

  getAnswer() {
    const state = get();
    const key = state.script[state.currentIndex].key;
    return state.data[key] ?? "";
  },
  getAnswers() {
    return get().data;
  },
  setAnswer(key: AnswerKey, value: string) {
    const state = get();
    state.data[key] = value;
    set({
      data: {
        ...state.data,
      },
    });
    state._backupToCookie(key, value);
  },
  loadFromCookies() {
    const state = get();
    const cookies = Cookies.get();

    for (const question of questions) {
      let key: AnswerKey = question.key as AnswerKey;
      let cookieKey = `${PREFIX}.${key}`;
      if (cookies[cookieKey]) {
        state.data[key] = cookies[cookieKey];
      }
    }
    set({
      data: {
        ...state.data,
      },
      isLoadedFromCookie: true,
    });
    console.log("cookies", cookies);
    console.log("data", get().data);
  },
  _backupToCookie: (key: string, value: string) => {
    Cookies.set(`${PREFIX}.${key}`, value);
    Cookies.set(`${PREFIX}.updated_at`, new Date().toISOString());
  },
}));

export default useScriptStore;
