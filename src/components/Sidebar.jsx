import { IconBuildingCommunity, IconCircleFilled, IconFileInvoice, IconHeadset, IconHome, IconUsers } from "@tabler/icons-react";
import { Layout, Menu } from "antd";
import { pallette } from "../utils/pallete";
import useSidebarStore from "../store/sidebar";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {

    const collapse = useSidebarStore(state => state.collapse)
    const navigate = useNavigate();

    const items = [
        {
            key: '1',
            label: 'Dashboard',
            icon : <IconHome style={{ marginLeft: -3 }} size={22} stroke={1.5} />,
            onClick: () => navigate('/')
        },
        {
            key: 'property-management',
            label: 'Manajemen Properti',
            icon : <IconBuildingCommunity style={{ marginLeft: -3 }} size={22} stroke={1.5} />,
            children: [
                {
                    key: 'property-management/property',
                    label: 'Properti',
                    icon: <IconCircleFilled size={8} />,
                    onClick: () => navigate('property-management/property')
                },
                {
                    key: 'property-management/unit',
                    label: 'Unit',
                    icon: <IconCircleFilled size={8} />,
                    onClick: () => navigate('property-management/unit')
                },
            ]
        },
        {
            key: 'renters-management',
            label: 'Manajemen Penyewa',
            icon : <IconUsers style={{ marginLeft: -3 }} size={22} stroke={1.5} />,
            children: [
                {
                    key: 'renters-management/renters',
                    label: 'Penyewa',
                    onClick: () => navigate('renters-management/renters'),
                    icon: <IconCircleFilled size={8} />,
                },
                {
                    key: 'renters-management/rental-history',
                    label: 'Riwayat Sewa',
                    icon: <IconCircleFilled size={8} />,
                },
            ]
        },
        {
            key: 'transaction',
            label: 'Data Transaksi',
            icon : <IconFileInvoice style={{ marginLeft: -3 }} size={22} stroke={1.5} />,
            children: [
                {
                    key: 'transaction/rent',
                    label: 'Penyewaan',
                    onClick: () => navigate('transaction/rent'),
                    icon: <IconCircleFilled size={8} />,
                },
                {
                    key: 'transaction/sale',
                    label: 'Penjualan',
                    icon: <IconCircleFilled size={8} />,
                    onClick: () => navigate('transaction/sale')
                },
            ]
        },
        {
            key: 'customer-service',
            label: 'Customer Service',
            icon : <IconHeadset style={{ marginLeft: -3 }} size={22} stroke={1.5} />,
            onClick: () => navigate('/customer-service')
        },
    ]
    
    return (
        <Layout.Sider 
            style={{ 
                borderRadius: 8, 
                backgroundColor: pallette.white,  
                position: 'relative' ,
                overflow: 'hidden',
            }} 
            width={240}
            collapsedWidth={60}
            collapsed={collapse}
        >
            <Menu
                items={items}
                mode="inline"
                defaultSelectedKeys={['1']}
            />
        </Layout.Sider>
        // <div  >
        // </div>
    )
}