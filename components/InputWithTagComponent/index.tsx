import { PlusOutlined } from "@ant-design/icons";
import { Input, Tag, Tooltip } from "antd";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";

import RenderIf from "@/utils/RenderIf/renderIf";

interface IInputWithTagComponentProps {
  tags: any;
  setTags: any;
}
const InputWithTagComponent = (props: IInputWithTagComponentProps) => {
  const { tags, setTags } = props;
  // State & constants
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState<number>();
  const [editInputValue, setEditInputValue] = useState("");

  const inputRef = useRef<any>(null);
  const editInputRef = useRef<any>(null);

  // Life cycle methods
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [inputValue]);

  // Event methods
  const handleClose = (removedTag: string) => {
    const newTagsArr = tags.filter((tag: string) => tag !== removedTag);
    setTags(newTagsArr);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputValue((e.target as HTMLInputElement).value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue as string]);
    }

    setInputVisible(false);
    setInputValue("");
  };

  const handleEditInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setEditInputValue((e.target as HTMLInputElement).value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    if (editInputIndex) {
      newTags[editInputIndex] = editInputValue;
      setTags(newTags);
      setEditInputIndex(-1);
      setInputValue("");
    }
  };

  return (
    <>
      {tags.map((tag: string, index: number) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              size="small"
              className="tag-input"
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }

        const isLongTag = tag.length > 20;
        const tagElem =
          _.size(tag) > 0 ? (
            <Tag className="edit-tag" key={tag} closable onClose={() => handleClose(tag)}>
              <span
                onDoubleClick={(e) => {
                  if (index !== 0) {
                    setEditInputIndex(index);
                    setEditInputValue(tag);
                    e.preventDefault();
                  }
                }}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </span>
            </Tag>
          ) : (
            ""
          );

        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}

      <RenderIf isTrue={inputVisible === true}>
        <Input
          ref={inputRef}
          type="text"
          size="small"
          className="tag-input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      </RenderIf>

      <RenderIf isTrue={inputVisible === false}>
        <Tag className="site-tag-plus" onClick={showInput}>
          <PlusOutlined /> Add skills
        </Tag>
      </RenderIf>
    </>
  );
};

export default InputWithTagComponent;
