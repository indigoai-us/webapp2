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

    if(id) {
      const getResponse = await fetch(`${url}/commands/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const gotData = await getResponse.json();

      res.status(200).json(gotData)  
    }

    if(!id) {
      const getResponse = await fetch(`${url}/commands`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const gotData = await getResponse.json();

      res.status(200).json(gotData)  
    }

  } catch (err: any) {
    console.log('err', err);
    res.status(500).json({err});
  }

}
