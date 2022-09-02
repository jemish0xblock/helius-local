import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { useAppDispatch } from "@/hooks/redux";

import { captchaActions } from "./captchaSlice";

interface ICaptchaProps {
  formName: string;
}
export const captchaRef = React.createRef<ReCAPTCHA>();

const CaptchaComponent = (props: ICaptchaProps) => {
  const { formName } = props;
  const dispatch = useAppDispatch();

  const captchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;

  // useEffect(() => {
  //   // Resting captcha store states
  //   dispatch(captchaActions.resetCaptchaState());
  //   console.log('formName: ', formName);
  //   if (formName !== "") {
  //     dispatch(captchaActions.setCaptchaFormName({ formName }));
  //   }
  // }, []);

  // Api call
  const verifyCaptcha = async (token: string) => {
    const params = {
      token,
      formName,
    };
    dispatch(captchaActions.validateCaptcha(params));
    // dispatch(asyncValidateCaptcha(params));
  };

  const onErrorInCaptcha = async () => {
    captchaRef?.current?.reset();
    dispatch(captchaActions.resetCaptchaState());
  };

  const onVerifyCaptchaCallback = async (token: string | null) => {
    if (!token) {
      onErrorInCaptcha();
      return;
    }
    await verifyCaptcha(token);
  };

  return (
    <ReCAPTCHA
      style={{ marginBottom: "15px" }}
      ref={captchaRef}
      sitekey={captchaSiteKey || ""}
      onChange={onVerifyCaptchaCallback}
      onExpired={onErrorInCaptcha}
      onErrored={onErrorInCaptcha}
    />
  );
};

export default CaptchaComponent;
