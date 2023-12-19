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

    let {id, sub} = req.query;

    if(id) {
      const getResponse = await fetch(`${url}/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const gotData = await getResponse.json();

      res.status(200).json(gotData)  
    }

    if(sub) {
      if(Array.isArray(sub)) {
        sub = sub[0];
      }

      const urlObj = new URL(`${url}/users`);
      urlObj.searchParams.append('sub', sub);

      const getResponse = await fetch(urlObj.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const gotData = await getResponse.json();

      res.status(200).json(gotData)  
    }

    if(!id) {
      const getResponse = await fetch(`${url}/users`, {
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
