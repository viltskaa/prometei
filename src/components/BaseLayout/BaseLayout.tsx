import React from 'react';
import HeaderIsland from "../HeaderIsland/HeaderIsland.tsx";
import {Layout, theme} from "antd";
import {Outlet} from "react-router-dom";

const {
    Content,
    Footer
} = Layout;

const BaseLayout = (): React.ReactElement => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <Layout className='h-100 container-fluid p-0' style={{
            background: colorBgContainer,
        }}>
            <HeaderIsland/>

            <Content className='px-3 h-100'>
                <Outlet/>
            </Content>

            <Footer style={{
                textAlign: 'center',
                background: 'none'
            }}>
                @Prometei
            </Footer>
        </Layout>
    );
};

export default BaseLayout;