import { IconSearch } from "@tabler/icons-react";
import { Button, Card, Flex, Input, Popconfirm, Space, Table } from "antd";
import { useTableHeight } from "../hook/useTableHeight";
import { useEffect } from "react";
import useNavbarStore from "../store/navbarStore";
import { AlertCircle } from "react-feather";

export default function SaleRentPage(){

    const { setTitle } = useNavbarStore();

    const tableHeight = useTableHeight();

    useEffect(() => {
        setTitle("Data Sewa & Jual");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [
        {
            title: 'No. Transaksi',
            key: 'transaction_number',
            dataIndex: 'transaction_number',
        },
        {
            title: 'Unit',
            key: 'unit',
            dataIndex: 'unit',
        },
        {
            title: 'Properti',
            key: 'property',
            dataIndex: 'property',
        },
        {
            title: 'Penyewa',
            key: 'renter',
            dataIndex: 'renter',
        },
        {
            title: "Aksi",
            key: "action",
            fixed: 'right',
            width: 150,
            render: () => (
              <Space>
                <Button  variant="outlined" color="primary" onClick={() => {}} size="small">
                  Detail
                </Button>
                <Popconfirm
                  placement="right"
                  title="Pemberitahuan"
                  description="Yakin ingin menghapus data ini?"
                  okText="Hapus"
                  cancelText="Tidak"
                  icon={<AlertCircle color="red" strokeWidth={1.2} style={{ marginRight: 6 }} />}
                //   onConfirm={() => handleDelete(record.id)}
                  okButtonProps={{
                    loading: false,
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

    const dataSource = [
        {
            transaction_number: '123',
            unit: 'Unit 401',
            property: 'Apartment Vida View',
            renter: 'Renter 1',
        }
    ]

    return (
        <div style={{ marginTop: 40 }}>
            <Card>
                <Flex justify="space-between" style={{ marginBottom: 15 }}>
                <Input
                    style={{ width: 180 }}
                    placeholder="Cari"
                    prefix={<IconSearch size={16} />}
                />
                <Button onClick={() => {}} type="primary">
                    Tambah Transaksi
                </Button>
                </Flex>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    loading={false}
                    scroll={{ y: tableHeight }}
                    rowKey="id"
                />
            </Card>
        </div>
    )
}