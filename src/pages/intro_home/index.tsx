import React from "react";
import { faHatWizard, faPen } from "@fortawesome/free-solid-svg-icons";
import useProductController from "@/controllers/product_controller";
import { Button } from "@/components/generals/button";
import Link from "next/link";
import { PAGE_URI } from "@/configs/page_uri";

const IntroHome = () => {
  const { available } = useProductController();

  return (
    <div className="flex flex-col w-full h-screen justify-center space-y-10">
      <div className="mx-auto lg:w-1/2 md:w-2/3 w-full px-5">
        <h2 className="text-2xl lg:md:text-4xl font-extrabold text-center">
          You havn&apos;t your great intro, lets start with wizard
        </h2>
      </div>
      <div className="flex-row space-x-4 flex justify-center">
        <Link
          key={PAGE_URI.INTRO_WIZARD}
          href={`${PAGE_URI.INTRO_WIZARD}/${available?.id}`}
        >
          <Button theme="default" icon={faHatWizard}>
            Wizard
          </Button>
        </Link>
        <Link
          key={PAGE_URI.INTRO_EDITOR}
          href={`${PAGE_URI.INTRO_EDITOR}/${available?.id}`}
        >
          <Button theme="alternative" rightIcon={faPen}>
            {available?.intro?.trim().length > 0
              ? "Go to editor"
              : "Start from scratch"}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default IntroHome;
