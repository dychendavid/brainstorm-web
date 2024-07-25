import React, {
  BaseSyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  faArrowLeft,
  faArrowRight,
  faHatWizard,
} from "@fortawesome/free-solid-svg-icons";

import { animated, useTransition } from "@react-spring/web";
import { SubmitHandler, useForm } from "react-hook-form";
import useScriptStore, { AnswerKey } from "@/stores/script_store";
import useProductStore from "@/stores/product_store";
import useProductController from "@/controllers/product_controller";
import { Button } from "@/components/generals/button";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import BaseModal from "@/components/modals/base_modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useModal } from "@/hooks/useModal";
import useAuthController from "@/controllers/auth_controller";
import useAuthStore from "@/stores/auth_store";
import { PAGE_URI } from "@/configs/page_uri";
import {
  AUTO_SAVED_INTERVAL,
  AUTO_SAVED_NOTIFY_DURATION,
} from "@/configs/config";

type MessageInput = {
  answer?: string;
  key?: AnswerKey;
};

enum ControlButtonType {
  BACK,
  RESTART,
  SKIP,
  NEXT,
  FINISH,
}

const IntroWizard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const scriptStore = useScriptStore();
  const productStore = useProductStore();
  const { askAiMutation } = useProductController(params?.id);
  const { auth } = useAuthController();
  const authStore = useAuthStore();
  const modal = useModal();

  const { register, handleSubmit, reset, getValues, setValue, setFocus } =
    useForm<MessageInput>();

  const onSubmit: SubmitHandler<MessageInput> = useCallback(
    (data) => {
      if (!scriptStore.isLast()) {
        handleNextOnSubmit();
        return;
      }

      scriptStore.setAnswer(scriptStore.getQuestion().key, data.answer);
      setIsLoading(true);
      askAiMutation.mutate(scriptStore.getAnswers(), {
        onSuccess: (data) => {
          productStore.setName(scriptStore.getAnswers().name);
          productStore.setIntro(data.intro);
          console.log(productStore);
          router.push(`${PAGE_URI.INTRO_EDITOR}/${params?.id}`);
        },
        onError: (e) => {
          modal.setTitle("Operation failed");
          modal.setDesc(e.message);
          modal.setIsOpen(true);
        },
        onSettled: (e) => {
          setIsLoading(false);
        },
      });
    },
    [params?.id]
  );

  const handleNextOnSubmit = useCallback(() => {
    scriptStore.setAnswer(scriptStore.getQuestion().key, getValues("answer"));
    scriptStore.next();
    reset({ answer: scriptStore.getAnswer() });
  }, [scriptStore.currentIndex]);

  const handleBack = useCallback(() => {
    if (scriptStore.currentIndex == 0) {
      router.back();
      return;
    }
    scriptStore.back();
    reset({ answer: scriptStore.getAnswer() });
  }, [scriptStore.currentIndex]);

  useEffect(() => {
    setFocus("answer");
    setIsEditing(getValues("answer") !== "");
  }, [scriptStore.currentIndex]);

  const handleChange = useCallback((e: BaseSyntheticEvent) => {
    setIsEditing(getValues("answer") !== "");
  }, []);

  const nextButtonType: ControlButtonType = useMemo(() => {
    if (scriptStore.isLast()) {
      return ControlButtonType.FINISH;
    } else if (isEditing) {
      return ControlButtonType.NEXT;
    } else {
      return ControlButtonType.SKIP;
    }
  }, [isEditing, scriptStore.currentIndex]);

  // control question fading transition
  const transitions = useTransition(scriptStore.currentIndex, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 300 },
    exitBeforeEnter: true,
    onChange: (e) => {
      if (e.value.opacity == 0) {
        setTitle(scriptStore.getQuestion().desc);
      }
    },
  });

  // Draft saver
  useEffect(() => {
    let intervalId = setInterval(() => {
      if (scriptStore.getAnswer() === getValues("answer")) {
        return;
      }

      scriptStore.setAnswer(scriptStore.getQuestion().key, getValues("answer"));

      toast.info("Draft auto saved.", {
        position: "top-center",
        theme: "dark",
        pauseOnHover: false,
        autoClose: AUTO_SAVED_NOTIFY_DURATION,
      });
    }, AUTO_SAVED_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Initial loading
  useEffect(() => {
    if (!scriptStore.isLoadedFromCookie) {
      scriptStore.loadFromCookies();
      return;
    }

    setValue("answer", scriptStore.getAnswer());
    setTitle(scriptStore.getQuestion().desc);
    setIsEditing(scriptStore.getAnswer().trim() !== "");
  }, [scriptStore.isLoadedFromCookie]);

  useEffect(() => {
    if (auth) {
      authStore.setToken(auth.token);
    }
  }, [auth]);
  return (
    <>
      <div className="flex flex-col w-full h-screen justify-center space-y-5">
        <div className="mx-auto w-1/2">
          {transitions((style, currentIndex) => (
            <animated.h2
              style={style}
              className="text-3xl font-extrabold text-center"
              key={currentIndex}
            >
              {title}
            </animated.h2>
          ))}
        </div>
        <div className="mx-auto w-1/2">
          <div className="text-right mb-4">{`${
            scriptStore.currentIndex + 1
          } / ${scriptStore.script.length}`}</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <textarea
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 mb-4"
              placeholder={
                "Ex:" + scriptStore.getQuestion().placeholder ??
                "Write your thoughts here..."
              }
              defaultValue={scriptStore.getAnswer()}
              onKeyUp={handleChange}
              {...register("answer")}
            ></textarea>
            <div className="flex justify-between">
              <Button
                theme="alternative"
                icon={faArrowLeft}
                onClick={handleBack}
              >
                Back
              </Button>

              {nextButtonType == ControlButtonType.FINISH && (
                <Button
                  theme="default"
                  rightIcon={faHatWizard}
                  type="submit"
                  loading={isLoading}
                >
                  Generate
                </Button>
              )}

              {nextButtonType == ControlButtonType.NEXT && (
                <Button
                  rightIcon={faArrowRight}
                  type="submit"
                  loading={isLoading}
                >
                  Next
                </Button>
              )}

              {nextButtonType == ControlButtonType.SKIP && (
                <Button
                  theme="alternative"
                  rightIcon={faArrowRight}
                  type="submit"
                  loading={isLoading}
                >
                  Skip
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
      <BaseModal
        onClose={modal.onClose}
        isOpen={modal.isOpen}
        title={modal.title}
        desc={modal.desc}
      >
        <Button theme="red" onClick={modal.onClose}>
          Ok
        </Button>
      </BaseModal>
      <ToastContainer />
    </>
  );
};

export default IntroWizard;
