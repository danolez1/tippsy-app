"use client";
import { Card, Flex } from "antd";
import Meta from "antd/es/card/Meta";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import { paths } from "./routes/paths";

const features = [
  {
    title: "Charges",
    description: "Manage your charges here.",
    path: paths.charges,
    img: "card2.webp",
  },
  {
    title: "Category",
    description: "Manage your categories here.",
    path: paths.category,
    img: "category.webp",
  },
];
export default function Home() {
  return (
    <main>
      <Title>Features</Title>
      <Flex gap={16}>
        {features.map((feature) => (
          <Card
            key={feature.path}
            style={{ width: 300 }}
            cover={<img alt={feature.title} src={feature.img} />}
          >
            <Link href={feature.path}>
              <Meta title={feature.title} description={feature.description} />
            </Link>
          </Card>
        ))}
      </Flex>
    </main>
  );
}
