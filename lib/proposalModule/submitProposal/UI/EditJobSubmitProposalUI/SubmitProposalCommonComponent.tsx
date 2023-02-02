import { Button, Col, Form, Input, Row } from "antd";
import { startCase } from "lodash";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import InlineSVG from "svg-inline-react";

import { useAppSelector } from "@/hooks/redux";
import { fetchCurrentUserDetails } from "@/lib/auth/authSlice";
import { dollorIcon, RateIcon } from "@/utils/allSvgs";
import RenderIf from "@/utils/RenderIf/renderIf";

import s from "./styles.module.less";

const SubmitProposalCommonComponent = ({
  data,
  secondInputValue,
  showModalForExplainRate,
  feeChargeValues,
  onChangeHandlerSecondInputValues,
  onChangeHandlerFirstInputValues,
  firstInputValue,
}: any) => {
  const currentUserDetails = useAppSelector(fetchCurrentUserDetails);
  const { t } = useTranslation("common");

  return (
    <Row>
      <Col span={16}>
        <RenderIf isTrue={data?.paymentType === "hourly"}>
          <p>
            Your profile rate:<strong> ${currentUserDetails?.hourlyRate}.00/hr</strong>
          </p>
        </RenderIf>
        <Row className={s.proposal_terms_section_styling}>
          <Col span={12}>
            <div className={`${s.h_proposal_terms_Text} add-Required-submit-proposal-input-field`}>
              {data?.paymentType === "hourly" ? `${startCase(data?.paymentType)}` : "Bid"}
            </div>
            <p>Total amount the client will see on your proposal</p>
          </Col>
          <Col span={12}>
            <div className={`${s.h_postJob_input_field} model-input-field-style remove_before_input_styling`}>
              <Form.Item
                name="amountRate"
                className={s.h_postJob_ant_form_item}
                rules={[
                  {
                    required: true,
                    message:
                      data?.paymentType === "hourly"
                        ? t("validationErrorMsgs.requireRateValid")
                        : t("validationErrorMsgs.requireRateValid"),
                  },
                  () => ({
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    validator(_, value) {
                      if ((value <= 2 || value >= 1000) && data?.paymentType === "hourly") {
                        return Promise.reject(t("validationErrorMsgs.requireHourlyRateValid"));
                      }
                      if ((value <= 4 || value >= 1000001) && data?.paymentType === "fixed") {
                        return Promise.reject(t("validationErrorMsgs.requirefixedProjectRateValid"));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input
                  placeholder="Enter Rate"
                  addonBefore={<InlineSVG src={dollorIcon} height="auto" />}
                  addonAfter="/hr"
                  value={12}
                  onChange={(e) => onChangeHandlerFirstInputValues(e, data?.paymentType)}
                  type="number"
                />
              </Form.Item>
            </div>
          </Col>
        </Row>
        <Row className={s.proposal_terms_section_styling}>
          <Col span={12}>
            <div className={s.h_proposal_terms_Text}>
              {firstInputValue && firstInputValue <= 500 ? "20%" : ""} Helius Service Fee
              <Button className={s.h_explain_button} onClick={showModalForExplainRate}>
                Explain this
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <div className={`${s.h_postJob_input_field} model-input-field-style remove_before_input_styling`}>
              <Input
                addonBefore={<InlineSVG src={dollorIcon} height="auto" />}
                addonAfter="/hr"
                value={feeChargeValues === 0 ? 0 : `-${feeChargeValues}`}
                type="number"
                disabled
                bordered={false}
                readOnly
              />
            </div>
          </Col>
        </Row>
        <Row className={s.proposal_terms_section_styling} style={{ border: "none" }}>
          <Col span={12}>
            <div className={s.h_proposal_terms_Text}>You'll receive</div>
            <p>The estimated amount you'll receive after service fees </p>
          </Col>
          <Col span={12}>
            <div className={`${s.h_postJob_input_field} model-input-field-style remove_before_input_styling`}>
              <Input
                placeholder="Enter Rate"
                addonBefore={<InlineSVG src={dollorIcon} height="auto" />}
                addonAfter="/hr"
                type="number"
                value={secondInputValue}
                onChange={onChangeHandlerSecondInputValues}
                disabled
              />
            </div>
          </Col>
        </Row>
      </Col>
      <Col span={8}>
        <div className={s.h_proposal_terms_section_align_text}>
          <InlineSVG src={RateIcon} height="auto" />
          <p>Includes Helius {data?.paymentType} Protection.</p>
          <a> Learn more</a>
        </div>
      </Col>
    </Row>
  );
};
export default memo(SubmitProposalCommonComponent);
