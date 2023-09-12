import fs from 'fs';
import path from 'path';
import { NextResponse } from "next/server";
export async function GET(req: Request, res: Response) {

    const filePath = path.join(process.cwd(), 'db.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(fileData);


  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json(users);
}

export async function POST(req: Request, res: Response) {
  const {name } = await req.json();
console.log(name, 'name');
  const filePath = path.join(process.cwd(), 'db.json');
  const fileData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileData);

  data.push({name:name  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json(data );
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    
    const filePath = path.join(process.cwd(), 'db.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileData);
    
  const newUsers = (data.filter((user:{name:String},index:number) => {
    if (index != id) {
       return user;
    }
  }));
    
    
    fs.writeFileSync(filePath, JSON.stringify(newUsers));
    
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(newUsers);
    }