import "./style.css";
import {
  Input,
  Form,
  Button,
  DatePicker,
  Select,
  message,
  Col,
  Row,
  Space,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import customParseFormat from "dayjs/plugin/customParseFormat";
import TaskList from "../taskList";
import { ChangeEvent, useState } from "react";
import { addTask } from "../../store/slice/taskSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
dayjs.extend(customParseFormat);

const { TextArea } = Input;
const { Option } = Select;

function AddTaskForm() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const tasks = useSelector((state: RootState) => state.tasks.tasks) || [];
  const [data, setData] = useState(tasks);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState("OPEN");
  const [expand, setExpand] = useState(false);
  const dispatch = useDispatch();

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTitle(value);
  };
  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setDescription(value);
  };
  const handleDueDateChange = (dateString: any) => {
    setDueDate(dateString);
  };
  const handleTagsChange = (e: any) => {
    setTags(e);
  };
  const handleStatusChange = (e: any) => {
    setStatus(e);
  };

  const showMessage = () => {
    messageApi.open({
      type: "success",
      content: "Задача добавлена!",
    });
  };

  const onFormSubmit = () => {
    const currentDate = new Date();
    const inputData = {
      key: uuid(),
      timestamp: currentDate.toLocaleString(),
      title: title,
      description: description,
      dueDate: dueDate.toString(),
      tags: tags,
      status: status,
    };

    dispatch(addTask(inputData));
    showMessage();
    setExpand(false);
    form.resetFields();
  };

  const onCancel = () => {
    form.resetFields();
  };
  const disabledDate = (current: any) => {
    return (
      current && current < dayjs(new Date().toLocaleString()).endOf("hour")
    );
  };
  const tagList = ["Crucial", "High Priority", "Low Priority", "Usual"];
  const statusList = ["OPEN", "WORKING", "DONE", "OVERDUE"];

  return (
    <>
      {contextHolder}
      <Row style={{ paddingBottom: "40px", backgroundColor: "#222222" }}></Row>
      {/* FORM */}
      <Row style={{ marginBottom: "24px" }} justify="center" align={"middle"}>
        <Col span={8}>
          <Form
            className="form"
            form={form}
            onFinish={onFormSubmit}
            initialValues={{ status: status }}
          >
            {/* Title */}
            <Form.Item
              name="title"
              className="form-item"
              rules={[
                {
                  required: true,
                  message: "Please enter the title",
                },
              ]}
            >
              <Input
                placeholder="Title"
                maxLength={100}
                allowClear
                showCount
                onClick={() => setExpand(true)}
                onChange={handleTitleChange}
              />
            </Form.Item>
            {/* Description */}
            <Form.Item
              className="form-item"
              style={expand ? { display: "block" } : { display: "none" }}
              name="description"
              rules={[
                {
                  required: true,
                  message: "Enter task description",
                },
              ]}
            >
              <TextArea
                id="description"
                placeholder="Description"
                allowClear
                showCount
                autoSize={{
                  minRows: 2,
                  maxRows: 6,
                }}
                maxLength={1000}
                onChange={handleDescriptionChange}
              />
            </Form.Item>
            {/* Due Date */}
            <Form.Item
              className="form-item"
              style={expand ? { display: "block" } : { display: "none" }}
              name="dueDate"
              rules={[
                {
                  required: true,
                  message: "Please select the due date.",
                },
              ]}
            >
              <DatePicker
                id="dueDate"
                disabledDate={disabledDate}
                placeholder="Due Date"
                onChange={handleDueDateChange}
              />
            </Form.Item>
            {/* Tags */}
            <Form.Item
              className="form-item"
              name="tags"
              style={expand ? { display: "block" } : { display: "none" }}
            >
              <Select
                mode="tags"
                placeholder="Tags"
                allowClear
                onChange={handleTagsChange}
              >
                {tagList.map((tag, index) => {
                  return (
                    <Option key={index} value={tag}>
                      {tag}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            {/* Status */}
            <Form.Item
              className="form-item"
              style={expand ? { display: "block" } : { display: "none" }}
              name="status"
              rules={[
                {
                  required: true,
                  message: "Please set your status.",
                },
              ]}
            >
              <Select
                placeholder="Set Status"
                onChange={handleStatusChange}
                value={status}
              >
                {statusList.map((status, index) => {
                  return (
                    <Option key={index} value={status}>
                      {status}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            {/* CTA */}
            <Form.Item
              className="form-item"
              style={
                expand
                  ? { display: "block", marginTop: "20px" }
                  : { display: "none" }
              }
            >
              <Space size={8}>
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  htmlType="submit"
                >
                  Add Task
                </Button>
                <Button onClick={onCancel}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      {/* tasklist */}
      <Row justify="center">
        <Col span={20}>
          <TaskList data={data} setData={setData} />
        </Col>
      </Row>
    </>
  );
}

export default AddTaskForm;
