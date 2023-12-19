// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
const url = process.env.NODE_ENV === 'development' 
            ? 'http://localhost:8080' 
            : 'https://indigo-api-dev.diffuze.ai';

type Data = {
  name?: string,
  id?: string,
  err?: Object,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  try {

    const {id} = req.query;

    const deleteResponse = await fetch(`${url}/inputs/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const deletedData = await deleteResponse.json();
  
    const {_id} = deletedData;
  
    res.status(200).json({ id: _id });
  
  } catch (err: any) {
    console.log('err', err);
    res.status(500).json({err});
  }
  
}
