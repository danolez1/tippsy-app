"use client";
import { useModal } from "@/hooks/use-modal";
import { Charge, useStore } from "@/hooks/use-store";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  TableProps,
  Tag,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import { format } from "date-fns";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect } from "react";
import Chart from "react-apexcharts";
import toast from "react-hot-toast";

type ChargeForm = Pick<Charge, "amount" | "category" | "date" | "note">;

const initialValues: ChargeForm = {
  amount: 0,
  category: "",
  date: dayjs(new Date()),
  note: "",
};

export default function Page() {
  const {
    charges,
    category: categories,
    closeModal,
    addCharge,
    updateCharge,
    loadCharges,
    loadCategories,
    deleteCharge,
    selectCharge,
  } = useStore((state) => state);
  const [form] = Form.useForm();
  const { open, handleClose, handleOpen } = useModal();

  const columns: TableProps<Charge>["columns"] = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => (
        <span>
          {text.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
          })}
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Category",
      key: "category",
      dataIndex: "category",
      render: (_, { category }) => {
        const obj = categories.list.find((cat) => cat.$id == category);
        return (
          <>
            <Tag color={obj?.color}>{obj?.name.toUpperCase()}</Tag>
          </>
        );
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => <a>{format(new Date(text), "MMM d, y")}</a>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              selectCharge(record);
              form.setFieldsValue({
                amount: record.amount,
                date: dayjs(record.date),
                category: record.category,
                note: record.note,
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
                          Delete Charge
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Are you sure you want to delete charge of{" "}
                          <strong style={{ color: record.color }}>
                            {record.amount.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                              minimumFractionDigits: 0,
                            })}
                            {" on "}
                            {format(
                              new Date(record.date as string),
                              "MMM d, y"
                            )}
                          </strong>
                          ?
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
                        selectCharge(record);
                        deleteCharge();
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
    if (charges.loading == false && charges.list.length == 0) loadCharges();
    if (categories.loading == false && categories.list.length == 0)
      loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadCharges]);

  useEffect(() => {
    handleClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charges.loading, closeModal]);

  const options = {
    chart: {
      id: "apexchart-example",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: charges.list.map((charge) =>
        format(new Date(charge.date as string), "MMM d, y")
      ),
    },
  };
  const series = categories.list.map((category) => {
    return {
      name: category.name,
      data: charges.list.map((charge) =>
        charge.category == category.$id ? charge.amount : null
      ),
      color: category.color,
    };
  });

  return (
    <>
      <Flex dir="column" vertical gap={16}>
        <Flex justify="space-between">
          <Title level={4}>Charges</Title>
          <Button icon={<PlusOutlined />} type="primary" onClick={handleOpen}>
            Add Charges
          </Button>
        </Flex>

        <Chart
          options={options}
          series={series}
          type="line"
          width={"100%"}
          height={320}
        />

        <Table
          columns={columns}
          dataSource={charges.list.map((charge) => {
            return { ...charge, key: charge.$id };
          })}
        />
      </Flex>

      <Modal
        title="Add Charge"
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
              loading={charges.loading}
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    if (charges.selected != null) {
                      updateCharge(values);
                    } else addCharge(values);
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
          layout="vertical"
          variant="filled"
          name="form_in_modal"
          style={{ maxWidth: 600 }}
          autoComplete="off"
          initialValues={initialValues}
        >
          <Row>
            <Col span={14}>
              <Form.Item<ChargeForm>
                label="Date"
                name={"date"}
                rules={[
                  {
                    type: "object" as const,
                    required: true,
                    message: "Select date of charge.",
                  },
                ]}
              >
                <DatePicker style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item<ChargeForm>
                label="Amount"
                name={"amount"}
                rules={[
                  { required: true, message: "Charge amount is required." },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item<ChargeForm>
            label="Category"
            name={"category"}
            rules={[{ required: true, message: "Select a category." }]}
          >
            <Select>
              {categories.list.map((cat) => (
                <Select.Option
                  key={cat.$id}
                  value={cat.$id}
                  style={{ color: cat.color }}
                >
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item<ChargeForm> label="Note" name={"note"}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}