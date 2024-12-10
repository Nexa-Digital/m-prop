import {
    Button,
    Card,
    Drawer,
    Flex,
    Form,
    Input,
    Select,
    Table,
    Tag,
    message,
  } from "antd";
  import { useEffect, useState } from "react";
  import { IconSearch } from "@tabler/icons-react";
  
  import useNavbarStore from "../../store/navbarStore";
  import useDebounce from "../../hook/useDebounce";
  import { useTableHeight } from "../../hook/useTableHeight";
  import { useFetchAll, useStore, useUpdate, useDelete } from "../../hook/useApiHooks";
import TableAction from "../../components/TableAction";
  
  export default function UnitPage() {
    const { setTitle } = useNavbarStore();
    const tableHeight = useTableHeight();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
  
    const [keyword, setKeyword] = useState("");
    const [openDrawer, setOpenDrawer] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
  
    const debouncedKeyword = useDebounce(keyword, 500);

    const tableName = "units";
    
    const { data: units, loading: loadingTable, fetchAll: fetchUnit } = useFetchAll(tableName);
    const { store: storeProperty, loading: storeLoading } = useStore(tableName);
    const { update: updateProperty, loading: updateLoading } = useUpdate(tableName);
    const { deleteData, loading: deleteLoading } = useDelete(tableName);

    const { data: properties, fetchAll: fetchProperty } = useFetchAll('properties');
  
    useEffect(() => {
      setTitle("Manajemen Unit");
      fetchData();
      fetchProperty()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedKeyword]);
  
    const fetchData = () => {
      fetchUnit({
        searchParams: { name: debouncedKeyword },
        pagination: false,
        fields: `
          *,
          properties(
            name
          )
        `,
      });
    };
  
    const handleSubmit = async () => {
      const values = form.getFieldsValue();
      const { error } = isUpdateMode
        ? await updateProperty(values, values.id)
        : await storeProperty(values);

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
        title: "Unit",
        dataIndex: "name",
        key: "name",
        width: 260,
      },
      {
        title: "Properti",
        dataIndex: "properties",
        key: "properties",
        width: 120,
        render: (properties) => <Tag>{properties.name}</Tag>,
      },
      {
        title: "Ukuran",
        dataIndex: "size",
        key: "size",
        width: 120,
      },
      {
        title: "Harga",
        dataIndex: "price",
        key: "price",
        width: 120,
        render: r => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(r)
      },
      {
        title: "Tipe",
        dataIndex: "type",
        key: "type",
        width: 120,
        render: r => {
          if(r == 'for_rent') return <Tag color="cyan" >Unit Disewakan</Tag>
          if(r == 'for_sale') return <Tag color="magenta" >Unit Dijual</Tag>
        }
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 120,
        fixed: 'right',
        render: r => {
          switch (r) {
            case 'Sold':
              return <Tag color="blue" >Terjual</Tag>
            case 'Unsold':
              return <Tag color="orange" >Belum Terjual</Tag>
            case 'On Rent':
              return <Tag color="green" >Sedang Disewakan</Tag>
            case 'Available':
              return <Tag color="cyan" >Tersedia</Tag>
            case 'Maintenance':
              return <Tag color="red" >Dalam Perbaikan</Tag>
          }
        }
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
            dataSource={units}
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
              label="Unit"
              rules={[{ required: true, message: "Nama Unit wajib diisi" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Deskripsi"
              rules={[{ required: true, message: "Deskripsi unit wajib diisi" }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              name="property_id"
              label="Jenis Properti"
              rules={[{ required: true, message: "Properti wajib diisi" }]}
            >
              <Select
                options={properties.map((property) => ({
                  label: property.name,
                  value: property.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              name="size"
              label="Luas"
              rules={[{ required: true, message: "Luas unit wajib diisi" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="price"
              label="Harga"
              rules={[{ required: true, message: "Harga wajib diisi" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="facilities"
              label="Fasilitas"
              rules={[{ required: true, message: "Fasilitas wajib diisi" }]}
            >
              <Select mode="tags" />
            </Form.Item>
            <Form.Item
              name="type"
              label="Tipe Unit"
              rules={[{ required: true, message: "Tipe wajib diisi" }]}
            >
              <Select
                options={[
                  {
                    label: "Disewakan",
                    value: "for_rent",
                  },
                  {
                    label: "Dijual",
                    value: "for_sale",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status Unit"
              rules={[{ required: true, message: "Status wajib diisi" }]}
            >
              <Select
                options={[
                  {
                    label: "Terjual",
                    value: "Sold",
                  },
                  {
                    label: "Belum Terjual",
                    value: "Unsold",
                  },
                  {
                    label: "Sedang Disewa",
                    value: "On Rent",
                  },
                  {
                    label: "Tersedia",
                    value: "Available",
                  },
                  {
                    label: "Dalam Perbaikan",
                    value: "Maintenance",
                  },
                ]}
              />
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    );
  }
  