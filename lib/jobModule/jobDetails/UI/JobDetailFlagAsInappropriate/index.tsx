import { Form, Input, Radio } from "antd";

import CustomModalComponent from "@/components/customModalComponent/customModalComponent";
import { descriptionValidationRegex } from "@/lib/jobModule/jobPost/constants/validationRegx";
import sm from "@components/customModalComponent/style.module.less";

const { TextArea } = Input;
interface IJobDetailFlagAsInappropriate {
  form: any;
  showModalForAdvanceSearch: any;
  onFlagAsInappropriateSubmitModel: any;
  handleCancelForSearchModel: any;
  visibleModel: boolean;
  setVisibleModel: (value: React.SetStateAction<boolean>) => void;
}

const JobDetailFlagAsInappropriate: React.FC<IJobDetailFlagAsInappropriate> = ({
  form,
  onFlagAsInappropriateSubmitModel,
  handleCancelForSearchModel,
  visibleModel,
  setVisibleModel,
}) => (
  <CustomModalComponent
    handleCancel={handleCancelForSearchModel}
    setVisible={setVisibleModel}
    visible={visibleModel}
    title="Why are you Flagging this?"
    widthSize={520}
    onChangeModelSubmit={() => {
      form
        .validateFields()
        .then((values: any) => {
          form.resetFields();
          onFlagAsInappropriateSubmitModel(values);
        })
        .catch(() => {});
    }}
  >
    <Form
      form={form}
      name="JobPostFormDescription"
      onFinish={onFlagAsInappropriateSubmitModel}
      initialValues={{ modifier: "public" }}
    >
      <div className={sm.h_postJob_input_field}>
        <Form.Item
          label="Select the reason for flagging this"
          name="flaggingReason"
          className={`${sm.h_postJob_ant_form_item} h_custom_add_strick_sign h_postJob_input_field_model`}
          rules={[{ required: true, message: "Please select the reason" }]}
        >
          <Radio.Group style={{ width: "100%" }} name="JobType">
            <Radio value="Client is offering payment outside of Helius">
              Client is offering payment outside of Helius
            </Radio>
            <Radio value="Client is asking for free work">Client is asking for free work</Radio>
            <Radio value="Client is misrepresenting their identity">Client is misrepresenting their identity</Radio>
            <Radio value="Person is attempting to buy or use my Helius account">
              Person is attempting to buy or use my Helius account
            </Radio>
            <Radio value="Job post looks like a scam or contains a suspicious link">
              Job post looks like a scam or contains a suspicious link
            </Radio>
            <Radio value="Job post contains contact information">Job post contains contact information</Radio>
            <Radio value="Job post is illegal or unethical">Job post is illegal or unethical</Radio>
            <Radio value="Job is unclear or incomplete">Job is unclear or incomplete</Radio>
            <Radio value="This is a freelancer ad, not a job post">This is a freelancer ad, not a job post</Radio>
            <Radio value="It’s something else">It’s something else</Radio>
          </Radio.Group>
        </Form.Item>
      </div>
      <div className={sm.h_postJob_input_field}>
        <Form.Item
          label="Describe"
          name="flagDescription"
          className={`${sm.h_postJob_ant_form_item} h_custom_add_strick_sign h_postJob_input_field_model`}
          rules={[
            {
              required: true,
              message: "Please enter the description",
            },
            {
              pattern: new RegExp(descriptionValidationRegex),
              message: "field must contain at maximum 5000 characters.",
            },
          ]}
        >
          <TextArea placeholder="Describe the reason you have selected..." rows={8} />
        </Form.Item>
      </div>
    </Form>
  </CustomModalComponent>
);

export default JobDetailFlagAsInappropriate;
