import { Avatar, Button, Layout, Typography } from "antd";
import { pallette } from "../utils/pallete";
import { IconMenu3 } from "@tabler/icons-react";
import useSidebarStore from "../store/sidebar";
import useNavbarStore from "../store/navbarStore";

export default function Header() {

    const { toggle, collapse } = useSidebarStore( state => state )
    const { title } = useNavbarStore(state => state)

    return (
        <Layout.Header
            style={{ 
                display: 'flex', 
                alignItems: 'center',
                height: 'fit-content',
                padding: '10px', 
                borderRadius: 8,
                backgroundColor: pallette.white
            }}
        >
            <Button onClick={toggle} type={ collapse ? "primary" : null } icon={<IconMenu3 size={18} />} />
            <Typography.Title level={4} style={{ marginLeft: 10, marginBottom: 0 }} >
                {title}
            </Typography.Title>
            <Avatar style={{ marginLeft: 'auto' }} >R</Avatar>
        </Layout.Header>
    )
}