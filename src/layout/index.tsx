"use client";

import { paths } from "@/app/routes/paths";
import {
  FileDoneOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TagOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Button, Flex, Layout, Menu, Popover, theme } from "antd";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

const { Header, Sider, Content } = Layout;

const sideNav = [
  {
    key: paths.index,
    icon: <HomeOutlined />,
    label: <Link href={paths.index}>Home</Link>,
  },
  {
    key: paths.charges,
    icon: <FileDoneOutlined />,
    label: <Link href={paths.charges}>Charges</Link>,
  },
  {
    key: paths.category,
    icon: <TagOutlined />,
    label: <Link href={paths.category}>Category</Link>,
  },
];

interface State {
  collapsed: boolean;
  selected: string[];
}

const initialState: State = {
  collapsed: false,
  selected: [paths.index],
};

const App: React.FC<{ children: ReactNode }> = (props) => {
  const { children } = props;
  const [state, setState] = useState<State>(initialState);
  const path = usePathname();

  useEffect(() => {
    setState({ ...state, selected: [path] });
  }, [path]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={state.collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[path]}
          selectedKeys={[path]}
          items={sideNav}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Flex
            justify="space-between"
            align="center"
            style={{ marginRight: 16 }}
          >
            <Flex>
              <Button
                type="text"
                icon={
                  state.collapsed ? (
                    <MenuUnfoldOutlined />
                  ) : (
                    <MenuFoldOutlined />
                  )
                }
                onClick={() =>
                  setState({ ...state, collapsed: !state.collapsed })
                }
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
              <Title
                level={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "center",
                  alignSelf: "center",
                  margin: 0,
                }}
              >
                {" "}
                Tippsy Budgeting App
              </Title>
            </Flex>
            <Popover content={<></>} title="Profile" trigger="click">
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                icon={<UserOutlined />}
              />
            </Popover>
          </Flex>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "100vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
