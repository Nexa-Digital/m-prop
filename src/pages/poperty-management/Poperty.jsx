import {
    Button,
    Card,
    Drawer,
    Flex,
    Form,
    Input,
    Table,
    message,
  } from "antd";
  import { useEffect, useState } from "react";
  import { IconSearch } from "@tabler/icons-react";
  
  import useNavbarStore from "../../store/navbarStore";
  import useDebounce from "../../hook/useDebounce";
  import { useTableHeight } from "../../hook/useTableHeight";
  import { useFetchAll, useStore, useUpdate, useDelete } from "../../hook/useApiHooks";
import TableAction from "../../components/TableAction";
  
  export default function PopertyPage() {
    const { setTitle } = useNavbarStore();
    const tableHeight = useTableHeight();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
  
    const [keyword, setKeyword] = useState("");
    const [openDrawer, setOpenDrawer] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
  
    const debouncedKeyword = useDebounce(keyword, 500);
    
    const { data: properties, loading: loadingTable, fetchAll: fetchProperties } = useFetchAll("properties");
    const { store: storeProperty, loading: storeLoading } = useStore("properties");
    const { update: updateProperty, loading: updateLoading } = useUpdate("properties");
    const { deleteData, loading: deleteLoading } = useDelete("properties");
  
    useEffect(() => {
      setTitle("Manajemen Properti");
      fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedKeyword]);
  
    const fetchData = () => {
      fetchProperties({
        searchParams: { name: debouncedKeyword },
        pagination: false,
      });
    };
  
    const handleSubmit = async () => {
      const values = form.getFieldsValue();
      const { error } = isUpdateMode
        ? await updateProperty(values, values.id)
        : await storeProperty(values);
  
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
        title: "Properti",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Aksi",
        key: "action",
        fixed: 'right',
        width: 150,
        render: (_, record) => (
          <TableAction
            onClickEdit={() => openUpdateDrawer(record)}
            handleDelete={() => handleDelete(record.id)}
            deleteLoading={deleteLoading}
          />
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
            dataSource={properties}
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
            layout="vertical"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          >
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              name="name"
              label="Properti"
              rules={[{ required: true, message: "Nama properti wajib diisi" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    );
  }
  