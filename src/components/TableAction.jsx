/* eslint-disable react/prop-types */
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { Button, Popconfirm, Popover, Space } from "antd";
import { AlertCircle } from "react-feather";

export default function TableAction({ onClickEdit, handleDelete, deleteLoading }){

    return (
        <Space>
            <Popover content="Ubah" >
                <Button  
                    icon={<IconPencil size={20} />}
                    color="primary"
                    variant="filled"
                    onClick={onClickEdit} 
                />
            </Popover>
            <Popconfirm
                placement="right"
                title="Pemberitahuan"
                description="Yakin ingin menghapus data ini?"
                okText="Hapus"
                cancelText="Tidak"
                icon={<AlertCircle color="red" strokeWidth={1.2} style={{ marginRight: 6 }} />}
                onConfirm={handleDelete}
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
    )
}
