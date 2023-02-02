import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Button, Collapse, Select, Spin } from "antd";
import React, { FC, memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import CustomModalComponent from "@/components/customModalComponent/customModalComponent";
import { useAppSelector } from "@/hooks/redux";
import { categoriesListFromStore, getJobPostSkillsWithRelatablesList } from "@/lib/categories/categoriesSlice";
import ss from "@components/customModalComponent/style.module.less";
import s from "@lib/jobModule/jobPost/postJob.module.less";

import { SkillFormProps } from "../types/storeTypes";
import { jobSkillsProps } from "../types/type";

const { Panel } = Collapse;

const JobPostSkillForm: FC<SkillFormProps | any> = ({
  form,
  onJobSubCategoryChange,
  onJobSpecialityChange,
  filterSubCategoryList,
  filterSpecialityList,
  onJobCategoryChange,
  addSkills,
  skillValues,
  setSkillValues,
  jobSpeciality,
  formOnChangeMethod,
  handleOnFinish,
  isLoading,
}) => {
  const { t } = useTranslation("common");
  const [loadmore, setLoadMore] = useState(3);
  const [visibleCategory, setVisibleCategory] = useState(false);
  const allSkillList = useAppSelector(getJobPostSkillsWithRelatablesList);
  const [allSkillValues, setAllSkillValues] = useState<jobSkillsProps[]>([{ value: "", id: "" }]);
  const categoriesData = useAppSelector(categoriesListFromStore);
  const onChangeCollapse = () => {};
  const onClickLoadMore = () => {
    setLoadMore(loadmore + 3);
  };

  const onChangeDefaultSkillWithIds = (value: string) => {
    const findId = allSkillValues.filter((data: any) => data.value === value)[0];
    return findId?.id;
  };

  useEffect(() => {
    const uniqueArray: any = [];
    allSkillList?.map((data: any) =>
      // eslint-disable-next-line array-callback-return
      data?.items.map((opt: any) => {
        const singleObject = { value: opt?.title, id: opt?.id };
        if (!uniqueArray.includes(singleObject)) {
          uniqueArray.push(singleObject);
        }
      })
    );
    setAllSkillValues(uniqueArray);
  }, []);

  const handleChangeForSearchSkills = (value: any) => {
    if (value?.length >= 1) {
      value?.forEach((item: any) => {
        const findSkillId = onChangeDefaultSkillWithIds(item);
        const checkUsername = (obj: any) => obj.value === item;
        if (skillValues.some(checkUsername)) {
          setSkillValues(skillValues.filter((opt: any) => opt.id !== findSkillId));
        } else if (item !== "") {
          addSkills(item, findSkillId);
        }
      });
    } else {
      setSkillValues([]);
    }
  };
  const removeSkillsFromArrayList = (item: any) => {
    setSkillValues(skillValues.filter((value: any) => value.id !== item.id));
  };
  const showModalForCategory = () => {
    setVisibleCategory(true);
  };
  const onCategorySubmit = () => {
    form.setFieldsValue({ specialtyMain: jobSpeciality.value });
    setVisibleCategory(false);
  };

  const handleCancelForCategory = () => {
    setVisibleCategory(false);
  };

  return (
    <Form
      form={form}
      name="JobPostFormSkill"
      onFinish={handleOnFinish}
      onValuesChange={formOnChangeMethod}
      initialValues={{}}
    >
      <Spin spinning={isLoading}>
        <div>
          <div className="collapse-card-padding">
            <div className={s.h_postJob_input_field}>
              <Form.Item
                label={t("formItem.searchskills")}
                name="jobPostSkills"
                className={`${s.h_postJob_ant_form_item} skill-field-remove-icon`}
                rules={[{ required: false, message: t("validationErrorMsgs.requireJobSkill") }]}
              >
                <div className={s.h_jobSkill_Search}>
                  <Select
                    showSearch
                    mode="multiple"
                    maxTagCount="responsive"
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    showArrow
                    value={skillValues?.length > 0 ? skillValues : []}
                    className="select-multiple-tag-styling"
                    onChange={handleChangeForSearchSkills}
                    filterOption={(input, option) => (option!.children as unknown as string).includes(input)}
                    filterSort={(optionA, optionB) =>
                      (optionA!.children as unknown as string)
                        .toLowerCase()
                        .localeCompare((optionB!.children as unknown as string).toLowerCase())
                    }
                  >
                    {allSkillValues.map((opt: any) => (
                      <Select.Option key={`${opt.id}${Math.random()}`} value={opt.value}>
                        {opt.value}
                      </Select.Option>
                    ))}
                  </Select>

                  {/* <Button onClick={() => handleChangeForSearchSkills}>
                <SearchOutlined />
              </Button> */}
                </div>
              </Form.Item>
            </div>
            <div className="text-styling">{t("formItem.selectedskills")}</div>
            <div className={s.h_flex_wrap}>
              {skillValues.length > 0
                ? skillValues.map((item: any) =>
                    item.value !== "" ? (
                      <div className={s.h_postJob_button_layout} key={`${item.id}${Math.random()}`}>
                        <Button
                          icon={<CloseOutlined style={{ color: "#fff" }} />}
                          onClick={() => removeSkillsFromArrayList(item)}
                        >
                          {item.value}
                        </Button>
                      </div>
                    ) : null
                  )
                : null}
              <span className={s.h_form_action} style={{ marginLeft: "10px" }}>
                {skillValues.length > 6 ? (
                  <Button className={s.h_upload_file_text} htmlType="button" onClick={onClickLoadMore} size="large">
                    {t("formItem.seeMore")}
                  </Button>
                ) : null}
              </span>
            </div>
            <div className="add-skill-more"> {t("jobPostScreen.addSkills")} </div>
            <div className="text-styling">{t("jobPostScreen.popularSkills")}</div>

            {allSkillList?.map((item: any) =>
              item.title.split(" ")[1] === "Skills" ? (
                <div
                  className={s.h_flex_wrap}
                  key={`${item.id}${Math.random()}`}
                  // style={{ marginBottom: "50px" }}
                >
                  {item?.items?.slice(0, 3).map((opt: any) => (
                    <div className={s.h_postJob_button_layout_gray} key={`${opt.id}${Math.random()}`}>
                      <Button
                        icon={<PlusOutlined style={{ color: "#171717" }} />}
                        onClick={() => addSkills(opt.title, opt.id)}
                      >
                        {opt.title}
                      </Button>
                    </div>
                  ))}

                  <span className={s.h_form_action} style={{ marginLeft: "10px" }}>
                    {item?.items?.length > 6 ? (
                      <Button className={s.h_upload_file_text} htmlType="button" onClick={onClickLoadMore} size="large">
                        {t("formItem.seeMore")}
                      </Button>
                    ) : null}
                  </span>
                </div>
              ) : null
            )}
          </div>

          {allSkillList?.map((item: any) =>
            item.title.split(" ")[1] !== "Skills" ? (
              <Collapse
                defaultActiveKey={["1"]}
                className="custom-collapse-styled"
                expandIconPosition="end"
                key={item.id}
                onChange={onChangeCollapse}
              >
                <Panel header={item.title} key={item.id}>
                  <div className="collapse-card-padding" key={item.id}>
                    <div className={s.h_flex_wrap}>
                      {item?.items?.slice(0, 3).map((opt: any) => (
                        <div className={s.h_postJob_button_layout_gray} key={`${opt.id}${Math.random()}`}>
                          <Button
                            icon={<PlusOutlined style={{ color: "#171717" }} />}
                            onClick={() => addSkills(opt.title, opt.id)}
                          >
                            {opt.title}
                          </Button>
                        </div>
                      ))}
                      <span className={s.h_form_action} style={{ marginLeft: "10px" }}>
                        {item?.items?.length > 6 ? (
                          <Button
                            className={s.h_upload_file_text}
                            htmlType="button"
                            onClick={onClickLoadMore}
                            size="large"
                          >
                            {t("formItem.seeMore")}
                          </Button>
                        ) : null}
                      </span>
                    </div>
                  </div>
                </Panel>
              </Collapse>
            ) : null
          )}

          <div className={s.h_content_alignment} style={{ textAlign: "left", marginLeft: "10px" }}>
            <Button htmlType="button" onClick={showModalForCategory} className={s.h_upload_file_instraction}>
              {t("jobPostScreen.changeTechnology")}
            </Button>
          </div>
          <CustomModalComponent
            handleCancel={handleCancelForCategory}
            setVisible={setVisibleCategory}
            visible={visibleCategory}
            title={t("jobPostScreen.changeCategory")}
            widthSize={520}
            onChangeModelSubmit={onCategorySubmit}
          >
            <>
              <div className={ss.h_postJob_input_field}>
                <Form.Item
                  label={t("jobPostScreen.category")}
                  name="category"
                  className={`${ss.h_postJob_ant_form_item} model-input-field-style skill-field-remove-icon`}
                  rules={[
                    {
                      required: false,

                      message: t("validationErrorMsgs.requireJobCategory"),
                    },
                  ]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    size="middle"
                    placeholder={t("jobPostScreen.categoryPlaceholderText")}
                    onChange={onJobCategoryChange}
                  >
                    {categoriesData?.length > 0
                      ? categoriesData?.map((item: any) => (
                          <Select.Option key={`${item.id}${Math.random()}`} value={JSON.stringify(item)}>
                            {item.title}
                          </Select.Option>
                        ))
                      : null}
                  </Select>
                </Form.Item>
              </div>
              <div className={ss.h_postJob_input_field}>
                <Form.Item
                  label={t("jobPostScreen.subCategory")}
                  name="subCategory"
                  className={`${ss.h_postJob_ant_form_item} model-input-field-style skill-field-remove-icon`}
                  rules={[
                    {
                      required: false,

                      message: t("validationErrorMsgs.requireJobCategory"),
                    },
                  ]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    size="middle"
                    placeholder={t("jobPostScreen.subCategoryPlaceholderText")}
                    onChange={onJobSubCategoryChange}
                  >
                    {filterSubCategoryList?.length > 0
                      ? filterSubCategoryList?.map((item: any) => (
                          <Select.Option key={`${item.id}${Math.random()}`} value={JSON.stringify(item)}>
                            {item.title}
                          </Select.Option>
                        ))
                      : null}
                  </Select>
                </Form.Item>
              </div>
              <div className={ss.h_postJob_input_field}>
                <Form.Item
                  label={t("jobPostScreen.speciality")}
                  name="speciality"
                  className={`${ss.h_postJob_ant_form_item} model-input-field-style skill-field-remove-icon`}
                  rules={[
                    {
                      required: false,

                      message: t("validationErrorMsgs.requireSpeciality"),
                    },
                  ]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    size="middle"
                    placeholder={t("jobPostScreen.specialityPlaceholderText")}
                    onChange={onJobSpecialityChange}
                  >
                    {filterSpecialityList?.length > 0
                      ? filterSpecialityList?.map((item: any) => (
                          <Select.Option key={`${item.id}${Math.random()}`} value={JSON.stringify(item)}>
                            {item.title}
                          </Select.Option>
                        ))
                      : null}
                  </Select>
                </Form.Item>
              </div>
            </>
          </CustomModalComponent>
        </div>

        <div className={s.h_content_alignment}>
          <Button htmlType="submit" className={s.h_upload_file_instraction}>
            {t("jobPostScreen.continue")}
          </Button>
        </div>
      </Spin>
    </Form>
  );
};
export default memo(JobPostSkillForm);
