import {  IconPencil, IconSearch, IconTrash } from "@tabler/icons-react";
import { Button, Card, Drawer, Flex, Form, Input, message, Popconfirm, Popover, Select, Space, Table } from "antd";
import { useTableHeight } from "../../hook/useTableHeight";
import useNavbarStore from "../../store/navbarStore";
import { useEffect, useState } from "react";
import useDebounce from "../../hook/useDebounce";
import { useDelete, useFetchAll, useStore, useUpdate } from "../../hook/useApiHooks";
import { AlertCircle } from "react-feather";

export default function RentPage() {

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const [keyword, setKeyword] = useState("");
    const [openDrawer, setOpenDrawer] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const debouncedKeyword = useDebounce(keyword, 500);

    const { setTitle } = useNavbarStore();
    const tableHeight = useTableHeight();

    const tableName = "rents";
    
    const { data: rents, loading: loadingTable, fetchAll: fetchRent } = useFetchAll(tableName);
    const { store: storeProperty, loading: storeLoading } = useStore(tableName);
    const { update: updateProperty, loading: updateLoading } = useUpdate(tableName);
    const { deleteData, loading: deleteLoading } = useDelete(tableName);

    const { data: units, fetchAll: fetchUnit } = useFetchAll('units');
    const { data: renters, fetchAll: fetchRenter } = useFetchAll('renters');

    useEffect(() => {
        setTitle("Transaksi - Penyewaan");
        fetchData()
        fetchRenter()
        fetchUnit({
            fields: `*`,
            additionalFilters: {
                type: 'for_rent'
            }
        })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedKeyword]);

    const fetchData = () => {
        fetchRent({
          pagination: false,
          fields: `
            id,
            unit_id,
            renter_id,
            start,
            end,
            units (
                name,
                properties (
                    name
                )
            ),
            renters (
                name
            )
          `,
        });
    };
    
    const handleSubmit = async () => {
        form.validateFields().then( async ( values ) => {
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
        })
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
            title: 'Unit',
            key: 'unit',
            dataIndex: 'units',
            render: d => d.name
        },
        {
            title: 'Properti',
            key: 'property',
            dataIndex: 'units',
            render: d => d.properties.name
        },
        {
            title: 'Penyewa',
            key: 'renters',
            dataIndex: 'renters',
            render: d => d.name
        },
        {
            title: 'Tanggal Masuk',
            key: 'start',
            dataIndex: 'start',
            width: 160,
            render: date => new Intl.DateTimeFormat('id-ID',{
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(new Date(date))
        },
        {
            title: 'Tanggal Keluar',
            key: 'end',
            dataIndex: 'end',
            width: 160,
            render: date => new Intl.DateTimeFormat('id-ID',{
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(new Date(date))
        },
        {
            title: 'Tagihan',
            key: 'id',
            dataIndex: 'id',
            fixed: 'right',
            width: 100,
            render: data => 
            <Button  
                variant="outlined" 
                size="small" 
                color="primary" 
                onClick={() => openUpdateDrawer(data)}
            >
                Tagihan
            </Button>
        },
        {
            title: "Aksi",
            key: "action",
            fixed: 'right',
            width: 100,
            render: (_, record) => (
                <Space>
                    <Popover content="Ubah" >
                        <Button  
                            icon={<IconPencil size={20} />}
                            color="primary"
                            variant="filled"
                            onClick={() => openUpdateDrawer(record)} 
                        />
                    </Popover>
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
                        <Popover content="Hapus" >
                            <Button 
                                variant="filled" 
                                color="danger"
                                icon={<IconTrash size={20} stroke={2} />}
                            />
                        </Popover>
                    </Popconfirm>
            </Space>
            ),
          },
    ]

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
                    dataSource={rents}
                    pagination={false}
                    loading={loadingTable}
                    scroll={{ y: tableHeight }}
                    rowKey="id"
                />
            </Card>
            <Drawer
                open={openDrawer}
                title={isUpdateMode ? "Ubah Penyewaan" : "Tambah Penyewaan"}
                onClose={resetForm}
                width={520}
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
                        name="unit_id"
                        label="Unit"
                        rules={[{ required: true, message: "Unit wajib diisi" }]}
                    >
                        <Select
                            allowClear
                            options={units.map((unit) => ({
                                label: unit.name,
                                value: unit.id,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        name="renter_id"
                        label="Penyewa"
                        rules={[{ required: true, message: "Penyewa wajib diisi" }]}
                    >
                        <Select
                            allowClear
                            options={renters.map((unit) => ({
                                label: unit.name,
                                value: unit.id,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        name="start"
                        label="Tanggal Masuk"
                        rules={[{ required: true, message: "Penyewa wajib diisi" }]}
                    >
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item
                        name="end"
                        label="Tanggal Keluar"
                    >
                        <Input type="date" />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    )
}