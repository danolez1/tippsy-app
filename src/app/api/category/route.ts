import { ID, Query } from 'appwrite';
import { NextRequest, NextResponse } from 'next/server';
import { appDb, databases } from '../appwrite';

const categoryTable = process.env.APPWRITE_CATEGORY_TB!;

export async function GET(request: NextRequest) {
    const response = await databases.listDocuments(
        appDb,
        categoryTable,
        [Query.orderDesc("$createdAt")]
    );
    return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
    const data = await request.json();
    const response = await databases.createDocument(
        appDb,
        categoryTable,
        ID.unique(),
        data
    );
    return NextResponse.json(response);
}

export async function PATCH(request: NextRequest) {
    const data = await request.json();
    const response = await databases.updateDocument(
        appDb,
        categoryTable,
        data.id,
        { name: data.name, color: data.color }
    );
    return NextResponse.json(response);

}

export async function DELETE(request: NextRequest) {
    const data = await request.json();
    const response = await databases.deleteDocument(appDb,
        categoryTable, data.id);
    return NextResponse.json(response);
}

