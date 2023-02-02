import { Form, Input, Select } from "antd";
import { has } from "lodash";
import { useRouter } from "next/router";
import { useEffect } from "react";

import CustomModalComponent from "@/components/customModalComponent/customModalComponent";
import ss from "@components/customModalComponent/style.module.less";

const { Option } = Select;
interface IJobListAdvancedSearch {
  form: any;
  handleChangeForSearchSkills: (value: any) => void;
  onAdvanceSearchModelSubmit: any;
  handleCancelForSearchModel: any;
  visibleModel: boolean;
  searchValue: string[];
  setVisibleModel: (value: React.SetStateAction<boolean>) => void;
  searchOptionsList: any;
  filterOptionList: any;
}
const JobListAdvancedSearch: React.FC<IJobListAdvancedSearch> = ({
  form,
  handleChangeForSearchSkills,
  onAdvanceSearchModelSubmit,
  handleCancelForSearchModel,
  visibleModel,
  setVisibleModel,
  searchOptionsList,
  filterOptionList,
}) => {
  const router = useRouter();
  useEffect(() => {
    const { __INTERNAL__, setFieldsValue }: any = form;
    const formName = __INTERNAL__?.name;
    if (formName === "advancedSearchFilter" && has(router, "query")) {
      const { andTerms, orTerms, exactTerms, excludeTerms, titleTerm, skills } = router.query;
      setFieldsValue({
        searchText: andTerms || "",
        anySearchText: orTerms || "",
        exactPhrase: exactTerms || "",
        excludeWord: excludeTerms || "",
        titleSearch: titleTerm || "",
        skillSearch: skills || "",
      });
    }
  }, [form, router]);

  return (
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
        // initialValues={{
        //   // modifier: "public",
        //   searchText: filterOptionList?.andTerms[0],
        //   anySearchText: filterOptionList?.orTerms[0],
        //   exactPhrase: filterOptionList?.exactTerms[0],
        //   excludeWord: filterOptionList?.excludeTerms[0],
        //   titleSearch: filterOptionList?.titleTerm[0],
        // }}
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
            label="Exclude These Words"
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
        <div className={ss.h_postJob_input_field}>
          <Form.Item
            label="Title Search"
            name="titleSearch"
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
            label="Skill Search"
            name="skillSearch"
            className={`${ss.h_postJob_ant_form_item} h_postJob_input_field_model skill-field-remove-icon`}
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Select
              showSearch
              mode="multiple"
              maxTagCount="responsive"
              placeholder="Search to Select"
              optionFilterProp="children"
              className="select-multiple-tag-styling"
              onChange={handleChangeForSearchSkills}
              value={filterOptionList?.skills?.length > 0 ? filterOptionList?.skills : []}
              filterOption={(input, option) => (option!.children as unknown as string).includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA!.children as unknown as string)
                  .toLowerCase()
                  .localeCompare((optionB!.children as unknown as string).toLowerCase())
              }
            >
              {searchOptionsList.map((d: any) => (
                <Option key={d.id} value={d.tittle}>
                  {d.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </Form>
    </CustomModalComponent>
  );
};

export default JobListAdvancedSearch;
