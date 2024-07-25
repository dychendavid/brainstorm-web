import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { faRotateRight, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import useProductStore, { ProductProps } from "@/stores/product_store";
import useScriptStore from "@/stores/script_store";
import useProductController from "@/controllers/product_controller";
import { Button } from "@/components/generals/button";
import ConfirmModal from "@/components/modals/confirm_modal";
import AlertModal from "@/components/modals/alert_modal";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { ModalType, useModal } from "@/hooks/useModal";
import BaseModal from "@/components/modals/base_modal";
import useAuthController from "@/controllers/auth_controller";
import useAuthStore from "@/stores/auth_store";
import { PAGE_URI } from "@/configs/page_uri";
import {
  AUTO_SAVED_INTERVAL,
  AUTO_SAVED_NOTIFY_DURATION,
  DATA_LOADED_NOTIFY_DURATION,
} from "@/configs/config";

const IntroEditor = () => {
  const productStore = useProductStore();
  const scriptStore = useScriptStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const modal = useModal();
  const { saveMutation, product } = useProductController(params?.id);
  const { auth } = useAuthController();
  const authStore = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<ProductProps>();

  const onSubmit: SubmitHandler<ProductProps> = useCallback((data) => {
    setIsLoading(true);
    saveMutation.mutate(data, {
      onSuccess: () => {
        setIsSaved(true);
        modal.setIsOpen(true);
        modal.setType(ModalType.SAVE_MODAL);

        // sync data between form and store to prevent auto saved
        productStore.setName(data.name);
        productStore.setIntro(data.intro);

        // next time force load from api
        productStore.clearUpdatedAt();
      },
      onError: (e) => {
        modal.setDesc(e.message);
        modal.setIsOpen(true);
        modal.setType(ModalType.ERROR_MODAL);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  }, []);

  const handleConfirmRestart = useCallback(() => {
    modal.setIsOpen(false);
    productStore.clearUpdatedAt();
    scriptStore.restart();
    router.push(PAGE_URI.INTRO_HOME);
  }, []);

  const handleRestartModal = useCallback(() => {
    if (!isSaved) {
      modal.setType(ModalType.RESET_MODAL);
      modal.setIsOpen(true);
    } else {
      handleConfirmRestart();
    }
  }, [isSaved]);

  const handleCancel = useCallback(() => {
    modal.setIsOpen(false);
  }, []);

  const handleChange = useCallback(() => {
    setIsSaved(false);
  }, []);

  useEffect(() => {
    if (auth) {
      authStore.setToken(auth.token);
    }
  }, [auth]);

  // choose data source when initialize
  useEffect(() => {
    if (!productStore.isLoadedFromCookie) {
      productStore.loadFromCookies();
      return;
    }

    if (!product) {
      return;
    }

    let _loadedMsg;
    const cookiesTs = new Date(productStore.data?.updatedAt).getTime();
    const apiTs = new Date(product.updatedAt).getTime();

    // if updatedAt is missing, means user click restart, and it should load from api
    if (productStore.data.updatedAt && cookiesTs > apiTs) {
      setValue("name", productStore.data.name);
      setValue("intro", productStore.data.intro);
      _loadedMsg =
        "Loaded from Cookies, updated: " + moment(cookiesTs).format("HH:mm:ss");
      setIsSaved(false);
    } else {
      setValue("name", product.name);
      setValue("intro", product.intro);
      _loadedMsg =
        "Loaded from API, updated: " +
        moment(product.updatedAt).format("HH:mm:ss");
      setIsSaved(true);

      // write back api data to cookies
      productStore.setName(product.name);
      productStore.setIntro(product.intro);
    }

    toast.info(_loadedMsg, {
      position: "top-center",
      theme: "dark",
      pauseOnHover: false,
      autoClose: DATA_LOADED_NOTIFY_DURATION,
    });
  }, [product, productStore.isLoadedFromCookie]);

  // Draft saver
  useEffect(() => {
    let intervalId = setInterval(() => {
      if (modal.isOpen) return;
      if (
        productStore.data.name === getValues("name") &&
        productStore.data.intro === getValues("intro")
      ) {
        return;
      }

      productStore.setName(getValues("name"));
      productStore.setIntro(getValues("intro"));

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
  }, [productStore, modal.isOpen]);
  return (
    <>
      <div
        className="flex flex-col w-full h-screen justify-center space-y-10"
        id="page_intro_editor"
      >
        <div className="mx-auto lg:w-1/2 md:w-2/3 w-full px-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Product Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                {...register("name")}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Intro
              </label>
              <textarea
                rows={10}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 mb-4"
                placeholder="Write your thoughts here..."
                {...register("intro")}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="flex justify-center">
              <Button
                theme="alternative"
                onClick={handleRestartModal}
                icon={faRotateRight}
              >
                Restart
              </Button>
              <Button
                theme="default"
                type="submit"
                rightIcon={faFloppyDisk}
                loading={isLoading}
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
      <ConfirmModal
        isOpen={modal.isOpen && modal.type === ModalType.RESET_MODAL}
        desc="Continue will get rid of your draft, are you sure?"
        onClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmRestart}
      />
      <AlertModal
        isOpen={modal.isOpen && modal.type === ModalType.SAVE_MODAL}
        onOk={handleCancel}
        onClose={handleCancel}
        title="Success"
        desc="Product intro updated"
      />
      <BaseModal
        isOpen={modal.isOpen && modal.type === ModalType.ERROR_MODAL}
        title="Operation failed"
        desc={modal.desc}
        onClose={handleCancel}
      >
        <Button theme="alternative" onClick={handleCancel}>
          Ok
        </Button>
      </BaseModal>
      <ToastContainer />
    </>
  );
};

export default IntroEditor;
