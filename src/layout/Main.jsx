import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {  Layout } from "antd";
import { pallette } from "../utils/pallete";
import Header from "../components/Header";

export default function MainLayout(){
    return (
        <Layout 
            style={{ 
                display: 'flex', 
                height: '100vh', 
                width: '100vw', 
                padding: 10, 
                boxSizing: 'border-box',
                backgroundColor: pallette.grey,
                gap: 10,
                overflow: 'hidden',
            }} 
        >
            <Sidebar/>
            <Layout >
                <Header/>
                <Layout.Content>
                    <Outlet/>
                </Layout.Content>
            </Layout>
        </Layout>
    )
}