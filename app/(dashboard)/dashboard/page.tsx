"use client";

import React, { useEffect, useState } from "react";
import { ButtonDemo, BreadcrumbDemo } from "@/components/index";
import { DataTableDemo } from "./data-table/DataTableDemo";
import { Payment, columns } from "./data-table/columns";
import localData from "@/localData";
import { Card, CardContent } from "@/components/ui/card";
import { useFirebaseApiContext } from "@/context/FirebaseApiContext";

const {  } = localData.images;

const breadcrumbItems = [
  {
    label: "Dashboard",
  },
];

const Page = () => {
  const [filteredData, setFilteredData] = useState<Payment[]>([]);
  // const data = getData();

  const { getUsers, fetchedUsers } = useFirebaseApiContext();

  useEffect(() => {
    getUsers({});
  }, []);

  useEffect(() => {
    if (!fetchedUsers.list.length) return;

    const getData = (): Payment[] => {
      return fetchedUsers.list
        .filter((item) => item.isDeleted !== true)
        .map((item) => {
          return {
            status: "active",
            ...item,
            name: item.name || "",
          };
        });
    };

    const data = getData();

    setFilteredData(data);
  }, [fetchedUsers]);

  return (
    <main className="dashboard-page p-5">
      <h2 className="text-2xl mb-3">Dashboard</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />
      <br />

      <Card className="mb-[150px]">
        <CardContent>
          <DataTableDemo data={filteredData} columns={columns} />
        </CardContent>
      </Card>

    </main>
  );
};

export default Page;
