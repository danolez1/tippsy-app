import { ID, Query } from "appwrite";
import { NextRequest, NextResponse } from "next/server";
import { appDb, databases } from "../appwrite";

const chargeTable = process.env.APPWRITE_CHARGE_TB!;

export async function GET(request: NextRequest) {
  const response = await databases.listDocuments(appDb, chargeTable, [
    Query.orderDesc("$createdAt"),
  ]);
  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const response = await databases.createDocument(
    appDb,
    chargeTable,
    ID.unique(),
    data,
  );
  return NextResponse.json(response);
}

export async function PATCH(request: NextRequest) {
  const data = await request.json();
  let id = "";
  const response = await databases.updateDocument(appDb, chargeTable, data.id, {
    amount: data.amount,
    category: data.category,
    date: data.date,
    note: data.note,
  });
  return NextResponse.json(response);
}

export async function DELETE(request: NextRequest) {
  const data = await request.json();
  const response = await databases.deleteDocument(appDb, chargeTable, data.id);
  return NextResponse.json(response);
}
