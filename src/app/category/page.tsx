"use client";
import { useModal } from "@/hooks/use-modal";
import { Category, useStore } from "@/hooks/use-store";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  ColorPicker,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Skeleton,
  Space,
  Table,
  TableProps,
} from "antd";
import Title from "antd/es/typography/Title";
import _ from "lodash";
import { useEffect } from "react";
import toast from "react-hot-toast";

type CategoryForm = {
  name: string;
  color: string;
};

const initialValues: CategoryForm = {
  name: "",
  color: "",
};

export default function Page() {
  const {
    closeModal,
    category,
    addCategory,
    loadCategories,
    updateCategory,
    selectCategory,
    deleteCategory,
  } = useStore((state) => state);
  const [form] = Form.useForm();
  const { open, handleClose, handleOpen } = useModal();
  const columns: TableProps<Category>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },

    {
      title: "Color",
      key: "color",
      dataIndex: "color",
      render: (_, { color, name }) => (
        <Skeleton.Avatar size={16} active style={{ backgroundColor: color }} />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              selectCategory(record);
              form.setFieldsValue({
                name: record.name,
                color: record.color,
              });
              handleOpen();
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => {
              toast.custom((t) => (
                <div
                  className={`${
                    t.visible ? "animate-enter" : "animate-leave"
                  } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                  <div className="flex-1 w-0 p-2">
                    <div className="flex items-start">
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Delete Category
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Are you sure you want to delete{" "}
                          <strong style={{ color: record.color }}>
                            {record.name}?
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="w-full border  border-gray-200 rounded-none px-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        toast.dismiss(t.id);
                        selectCategory(record);
                        deleteCategory();
                      }}
                      className="w-full border border-gray-200 rounded-none rounded-r-lg px-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ));
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (!category.loading && category.list.length == 0)
      loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadCategories]);

  useEffect(() => {
    handleClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category.loading, closeModal]);

  return (
    <>
      <Flex dir="column" vertical gap={16}>
        <Flex justify="space-between">
          <Title level={4}>Category</Title>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              form.resetFields();
              handleOpen();
            }}
          >
            Add Category
          </Button>
        </Flex>

        <Table
          columns={columns}
          dataSource={category.list.map((cat) => {
            return { ...cat, key: cat.$id };
          })}
        />
      </Flex>

      <Modal
        title="Add Category"
        open={open}
        onCancel={handleClose}
        footer={
          <Flex gap={8} style={{ margin: 0 }} justify="end">
            <Button key="back" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={category.loading}
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    if (category.selected != null) {
                      updateCategory(values);
                    } else addCategory(values);
                    form.resetFields();
                  })
                  .catch((info) => {
                    console.log({ info });
                    if (_.has(info, ["errorFields"]))
                      toast.error(info.errorFields[0].errors);
                  });
              }}
            >
              Save
            </Button>
          </Flex>
        }
      >
        <Form
          form={form}
          initialValues={initialValues}
          layout="horizontal"
          variant="filled"
          name="form_in_modal"
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          <Row>
            <Col span={12}>
              <Form.Item<CategoryForm>
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Category name is required." },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={1} />

            <Col span={11}>
              <Form.Item<CategoryForm>
                label="Color"
                name="color"
                rules={[{ required: true, message: "Select a color." }]}
              >
                <ColorPicker showText />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
