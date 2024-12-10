import {
    Button,
    Card,
    Drawer,
    Flex,
    Form,
    Input,
    Popconfirm,
    Select,
    Space,
    Table,
    message,
  } from "antd";
  import { useEffect, useState } from "react";
  import { AlertCircle } from "react-feather";
  import { IconSearch } from "@tabler/icons-react";
  
  import useNavbarStore from "../store/navbarStore";
  import useDebounce from "../hook/useDebounce";
  import { useTableHeight } from "../hook/useTableHeight";
  import { useFetchAll, useStore, useUpdate, useDelete } from "../hook/useApiHooks";
  
  export default function CustomerServicePage() {
    const { setTitle } = useNavbarStore();
    const tableHeight = useTableHeight();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
  
    const [keyword, setKeyword] = useState("");
    const [openDrawer, setOpenDrawer] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
  
    const debouncedKeyword = useDebounce(keyword, 500);

    const tableName = "customer_services";
    
    const { data: customerServices, loading: loadingTable, fetchAll: fetchCustomerService } = useFetchAll(tableName);
    const { store: storeRenter, loading: storeLoading } = useStore(tableName);
    const { update: updateRenter, loading: updateLoading } = useUpdate(tableName);
    const { deleteData, loading: deleteLoading } = useDelete(tableName);

  
    useEffect(() => {
      setTitle("Customer Service");
      fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedKeyword]);
  
    const fetchData = () => {
      fetchCustomerService({
        searchParams: { name: debouncedKeyword },
        pagination: false,
        fields: `*`,
      });
    };
  
    const handleSubmit = async () => {
      const values = form.getFieldsValue();
      const { error } = isUpdateMode
        ? await updateRenter(values, values.id)
        : await storeRenter(values);

      console.log(values)

      if (!error) {
        messageApi.success("Data tersimpan");
        resetForm();
        fetchData();
      } else {
        messageApi.error("Gagal menyimpan data");
      }
    };
  
    const handleDelete = async (id) => {
      const { error } = await deleteData(id);
      if (!error) {
        messageApi.success("Data berhasil dihapus");
        fetchData();
      }
    };
  
    const openUpdateDrawer = (record) => {
      setIsUpdateMode(true);
      form.setFieldsValue(record);
      setOpenDrawer(true);
    };
  
    const resetForm = () => {
      form.resetFields();
      setOpenDrawer(false);
      setIsUpdateMode(false);
    };
  
    const columns = [
      {
        title: "Nama",
        dataIndex: "name",
        key: "name",
        width: 260,
      },
      {
        title: "Jenis Kelamin",
        dataIndex: "gender",
        key: "gender",
        render: e => e === 'L' ? 'Laki-laki' : 'Perempuan',
      },
      {
        title: "Nomor Telepon",
        dataIndex: "contact",
        key: "contact",
      },
      {
        title: "Aksi",
        key: "action",
        fixed: 'right',
        width: 150,
        render: (_, record) => (
          <Space>
            <Button  variant="outlined" color="primary" onClick={() => openUpdateDrawer(record)} size="small">
              Ubah
            </Button>
            <Popconfirm
              placement="right"
              title="Pemberitahuan"
              description="Yakin ingin menghapus data ini?"
              okText="Hapus"
              cancelText="Tidak"
              icon={<AlertCircle color="red" strokeWidth={1.2} style={{ marginRight: 6 }} />}
              onConfirm={() => handleDelete(record.id)}
              okButtonProps={{
                loading: deleteLoading,
                danger: true,
              }}
            >
              <Button variant="outlined" danger size="small">
                Hapus
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];
  
    return (
      <div style={{ marginTop: 40 }}>
        {contextHolder}
        <Card>
          <Flex justify="space-between" style={{ marginBottom: 15 }}>
            <Input
              style={{ width: 180 }}
              placeholder="Cari"
              prefix={<IconSearch size={16} />}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button onClick={() => setOpenDrawer(true)} type="primary">
              Tambah
            </Button>
          </Flex>
          <Table
            columns={columns}
            dataSource={customerServices}
            pagination={false}
            loading={loadingTable}
            scroll={{ y: tableHeight }}
            rowKey="id"
          />
        </Card>
  
        <Drawer
          open={openDrawer}
          title={isUpdateMode ? "Ubah Properti" : "Tambah Properti"}
          onClose={resetForm}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          width={500}
          footer={
            <Flex gap={20}>
              <Button onClick={resetForm} style={{ flex: 1 }}>
                Batal
              </Button>
              <Button
                loading={storeLoading || updateLoading}
                onClick={handleSubmit}
                type="primary"
                style={{ flex: 1 }}
              >
                Submit
              </Button>
            </Flex>
          }
        >
          <Form
            form={form}
            labelCol={{ span: 6 }}
            labelAlign="left"
          >
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              name="name"
              label="Nama"
              rules={[
                { required: true, message: "Nama wajib diisi" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="contact"
              label="No Telepon"
              rules={[
                { required: true, message: "No Telepon wajib diisi" },
                { type: 'number', message: 'No Telepon harus angka' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Jenis Kelamin"
              rules={[{ required: true, message: "Jenis Kelamin wajib diisi" }]}
            >
              <Select
                options={[
                  {
                    label: "Laki Laki",
                    value: "L",
                  },
                  {
                    label: "Perempuan",
                    value: "P",
                  },
                ]}
              />
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    );
  }
  