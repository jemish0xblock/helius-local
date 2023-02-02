import { Form, Input } from "antd";

import CustomModalComponent from "@/components/customModalComponent/customModalComponent";
import ss from "@components/customModalComponent/style.module.less";

interface IFreelancerAdvancedSearch {
  form: any;
  onAdvanceSearchModelSubmit: any;
  handleCancelForSearchModel: any;
  visibleModel: boolean;
  setVisibleModel: (value: React.SetStateAction<boolean>) => void;
}

const FreelancerAdvancedSearch: React.FC<IFreelancerAdvancedSearch> = ({
  form,
  onAdvanceSearchModelSubmit,
  handleCancelForSearchModel,
  visibleModel,
  setVisibleModel,
}) => (
  <CustomModalComponent
    handleCancel={handleCancelForSearchModel}
    setVisible={setVisibleModel}
    visible={visibleModel}
    title="Advanced Search"
    widthSize={520}
    onChangeModelSubmit={() => {
      form
        .validateFields()
        .then((values: any) => {
          form.resetFields();
          onAdvanceSearchModelSubmit(values);
        })
        .catch(() => {});
    }}
  >
    <Form
      form={form}
      name="advancedSearchFilter"
      onFinish={onAdvanceSearchModelSubmit}
      // initialValues={{ modifier: "public" }}
    >
      <div className={`${ss.h_postJob_input_field} `}>
        <Form.Item
          label="All of These Words"
          name="searchText"
          className={`${ss.h_postJob_ant_form_item} h_postJob_input_field_model skill-field-remove-icon`}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </div>
      <div className={ss.h_postJob_input_field}>
        <Form.Item
          label="Any of These Words"
          name="anySearchText"
          className={`${ss.h_postJob_ant_form_item} h_postJob_input_field_model skill-field-remove-icon`}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </div>
      <div className={ss.h_postJob_input_field}>
        <Form.Item
          label="The Exact Phrase"
          name="exactPhrase"
          className={`${ss.h_postJob_ant_form_item} h_postJob_input_field_model skill-field-remove-icon`}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </div>
      <div className={ss.h_postJob_input_field}>
        <Form.Item
          label="None of These Words"
          name="excludeWord"
          className={`${ss.h_postJob_ant_form_item} h_postJob_input_field_model skill-field-remove-icon`}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </div>
    </Form>
  </CustomModalComponent>
);

export default FreelancerAdvancedSearch;
