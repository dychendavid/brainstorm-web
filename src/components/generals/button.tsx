import React, { ButtonHTMLAttributes, MouseEvent, useState } from "react";

import { styled } from "@slicknode/stylemapper";
import classNames from "classnames";
import { isNil } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const themeBase =
  "focus:outline-none text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2";
const themes = {
  default: classNames(
    "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300",
    themeBase
  ),
  alternative:
    "py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100",
  red: classNames("bg-red-700 hover:bg-red-800 focus:ring-red-300", themeBase),
};

const fontSizes = {
  default: "text-sm",
  small: "text-xs",
  medium: "text-base",
  large: "text-lg",
  "x-large": "text-xl",
};

const heights = {
  default: 30,
  "x-small": 20,
  small: 25,
  medium: 30,
  large: 35,
  "x-large": 40,
};

const StyledButton = styled("button", {
  variants: {
    theme: themes,
    fontSize: fontSizes,
  },
});

export type ButtonThemes = typeof themes;
export type ButtonFontSizes = typeof fontSizes;

export type ButtonProps = {
  theme?: keyof ButtonThemes;
  size?: keyof ButtonFontSizes;
  children?: string | JSX.Element;
  icon?: IconProp;
  rightIcon?: IconProp;
  loading?: boolean;
  hideLoader?: boolean;
  height?: number;
  dataTest?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  theme = "default",
  size = "default",
  children = null,
  className,
  icon,
  rightIcon,
  onClick,
  loading = false,
  hideLoader = false,
  disabled = false,
  height = null,
  dataTest = null,
  type = "button",
  style,
  ...props
}: ButtonProps) => {
  const [onClickActive, setOnClickActive] = useState(false);
  const buttonHeight = height ?? heights[size];

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    if (onClickActive) {
      return;
    }

    setOnClickActive(true);
    await onClick?.(event);
    setOnClickActive(false);
  };

  const isLoading = !hideLoader && (loading || onClickActive);
  const hasLeftIcon = !isNil(icon);
  const hasRightIcon = !isNil(rightIcon);

  return (
    <StyledButton
      data-testid={dataTest}
      onClick={handleClick}
      theme={theme}
      fontSize={size}
      className={classNames(
        // Disabled state classes
        "disabled:cursor-not-allowed disabled:opacity-75 disabled:text-opacity-70"
      )}
      disabled={disabled || isLoading}
      type={type}
      style={{ ...style }}
      {...props}
    >
      {isLoading ? (
        <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
      ) : (
        <>
          {hasLeftIcon && <FontAwesomeIcon icon={icon} />}
          {!!children && (
            <span
              className={classNames("flex-none leading-none", {
                "mr-1": hasRightIcon,
                "ml-1": hasLeftIcon,
              })}
            >
              {children}
            </span>
          )}
          {hasRightIcon && <FontAwesomeIcon icon={rightIcon} />}
        </>
      )}
    </StyledButton>
  );
};
