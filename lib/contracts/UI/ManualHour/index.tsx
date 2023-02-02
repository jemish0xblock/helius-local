import { Form, Input, Row, Select, Col, DatePicker } from "antd";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import ModalComponent from "@/components/ModalWithFormComponent";

import s from "./manualhour.module.less";

interface IManualHourFormProps {
  isShowManualHourModal: boolean;
  manualHourIsLoading: boolean;
  setIsShowManualHourModal: any;
  onCreate: any;
}
const { Option } = Select;

const AddManualHours: FC<IManualHourFormProps> = ({
  isShowManualHourModal,
  manualHourIsLoading,
  setIsShowManualHourModal,
  onCreate,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  // const onChange: DatePickerProps["onChange"] = (date: any, dateString: string) => {
  //   // console.log("date", date, "dateString", dateString);
  //   form.setFieldsValue({
  //     startDate: dateString,
  //   });
  // };
  // get 10 min time slot
  const x = 10;
  const times = [];
  let tt = 0;
  const ap = [" AM", " PM"]; // AM-PM

  // loop to increment the time and push results in array
  for (let i = 0; tt < 24 * 60; i++) {
    const hh = Math.floor(tt / 60);
    const mm = tt % 60;
    times[i] = `${`0${hh % 12}`.slice(-2)}:${`0${mm}`.slice(-2)}${ap[Math.floor(hh / 12)]}`;
    tt += x;
  }
  const datePickerFormItemConfig = {
    rules: [{ type: "object" as const, required: true, message: t("validationErrorMsgs.requireField") }],
  };
  return (
    <ModalComponent
      title={<div className={s.h_modal_title}>Add manual time</div>}
      okText="Submit"
      cancelText={t("formItem.cancel")}
      isShow={isShowManualHourModal}
      confirmLoading={manualHourIsLoading}
      setIsShow={setIsShowManualHourModal}
      form={form}
      onCreate={onCreate}
    >
      <Form form={form} layout="vertical" name="add_manual_form">
        <Row>
          <Col span={24} className={s.h_amount_input}>
            <Form.Item name="date" colon={false} label="Date" {...datePickerFormItemConfig}>
              <DatePicker className="h_form_item_datePicker" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="timeZone"
              colon={false}
              label="Time zone"
              rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
            >
              <Select allowClear showArrow showSearch={false} maxTagCount="responsive">
                <Option key={1} value="local">
                  My local time
                </Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12} className={s.h_time_input}>
            <Form.Item
              name="startTime"
              colon={false}
              label="Start Time"
              rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
            >
              <Select allowClear showArrow showSearch={false} maxTagCount="responsive">
                <Option key={1} value="">
                  -
                </Option>
                {times?.length > 0 &&
                  times?.map((item: any) => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="endTime"
              colon={false}
              label="End Time"
              rules={[{ required: true, message: t("validationErrorMsgs.requireField") }]}
            >
              <Select allowClear showArrow showSearch={false} maxTagCount="responsive">
                <Option key={1} value="">
                  -
                </Option>
                {times?.length > 0 &&
                  times?.map((item: any) => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="memo" label="Memo">
          <Input.TextArea />
        </Form.Item>
        <p>Note: manual time does not qualify for Helius hourly Protection.</p>
      </Form>
    </ModalComponent>
  );
};

export default AddManualHours;
