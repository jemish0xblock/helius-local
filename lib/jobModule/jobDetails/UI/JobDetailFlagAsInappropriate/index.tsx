import { Form, Input, Radio } from "antd";

import CustomModalComponent from "@/components/customModalComponent/customModalComponent";
import { descriptionValidationRegex } from "@/lib/jobModule/jobPost/constants/validationRegx";
import sm from "@components/customModalComponent/style.module.less";

import { IFetchOptionsReasonList } from "../../types/storeTypes";

const { TextArea } = Input;
interface IJobDetailFlagAsInappropriate {
  form: any;
  showModalForAdvanceSearch: any;
  onFlagAsInappropriateSubmitModel: any;
  handleCancelForSearchModel: any;
  visibleModel: boolean;
  setVisibleModel: (value: React.SetStateAction<boolean>) => void;
  commonStoreDataList: any;
}

const JobDetailFlagAsInappropriate: React.FC<IJobDetailFlagAsInappropriate> = ({
  form,
  onFlagAsInappropriateSubmitModel,
  handleCancelForSearchModel,
  visibleModel,
  commonStoreDataList,
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
            {commonStoreDataList?.flagAsInappropriateList?.length > 0 &&
              commonStoreDataList?.flagAsInappropriateList.map((flag: IFetchOptionsReasonList) => (
                <Radio key={flag?.id} value={flag?.name}>
                  {flag?.name}
                </Radio>
              ))}
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
