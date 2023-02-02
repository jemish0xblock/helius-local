import { Form, Input, Row, Select, Col, InputNumber } from "antd";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import ModalComponent from "@/components/ModalWithFormComponent";
import { onlyAllowNumbersForMaxBudgetAndMin } from "@/lib/jobModule/jobPost/constants/validationRegx";

import s from "./payment.module.less";

interface IPaymentFormProps {
  isShowPaymentModal: boolean;
  paymentIsLoading: boolean;
  setIsShowPaymentModal: any;
  onCreate: any;
}
const { Option } = Select;

const FreelancerPayment: FC<IPaymentFormProps> = ({
  isShowPaymentModal,
  paymentIsLoading,
  setIsShowPaymentModal,
  onCreate,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  // useEffect(() => {
  //   if (noteFormData && has(noteFormData, "id")) {
  //     form.setFieldsValue({
  //       note: noteFormData?.note || "",
  //       softSkills: noteFormData?.softSkills || [],
  //       extraPhrase: noteFormData?.extraPhrase || [],
  //     });
  //   }
  // }, []);

  // const children: React.ReactNode[] = [];

  return (
    <ModalComponent
      title={
        <div className={s.h_modal_title}>
          Give bonus or expense reimbursement
          {/* Note about <span>&nbsp;{freelancerName || ""}.</span> */}
        </div>
      }
      okText="Make Payment"
      cancelText={t("formItem.cancel")}
      isShow={isShowPaymentModal}
      confirmLoading={paymentIsLoading}
      setIsShow={setIsShowPaymentModal}
      form={form}
      onCreate={onCreate}
    >
      <Form form={form} layout="vertical" name="add_note_form">
        <Row>
          <Col span={12} className={s.h_amount_input}>
            <Form.Item
              name="amount"
              colon={false}
              label="Amount"
              rules={[
                { required: true, message: t("validationErrorMsgs.requireJobBudget") },
                {
                  pattern: new RegExp(onlyAllowNumbersForMaxBudgetAndMin),
                  message: t("validationErrorMsgs.requireJobBudgetValid"),
                },
              ]}
            >
              <InputNumber addonBefore="$" defaultValue="" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="reason" colon={false} label="Reason">
              <Select allowClear showArrow showSearch={false} maxTagCount="responsive">
                <Option key={1} value="bonus">
                  Bonus
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>

        <Form.Item name="note" label="private Note (optional)">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </ModalComponent>
  );
};

export default FreelancerPayment;
