import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const data = await request.json();
    const result = {};
    return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
    const data = await request.json();
    const result = {};
    return NextResponse.json(result);
}

export async function DELETE(request: NextRequest) {
    const data = await request.json();
    const result = {};
    return NextResponse.json(result);
}

export async function PUT(request: NextRequest) {
    const data = await request.json();
    const result = {};
    return NextResponse.json(result);
}

export async function PATCH(request: NextRequest) {
    const data = await request.json();
    const result = {};
    return NextResponse.json(result);
}

export async function OPTION(request: NextRequest) {
    const data = await request.json();
    const result = {};
    return NextResponse.json(result);
}
