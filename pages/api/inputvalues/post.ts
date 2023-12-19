import type { NextApiRequest, NextApiResponse } from 'next'

const url = process.env.NODE_ENV === 'development' 
            ? 'http://localhost:8080' 
            : 'https://indigo-api-dev.diffuze.ai';

type Data = {
  name?: string,
  id?: string,
  err?: Object
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  try {

    console.log('req.body2', req.body);

    const response = await fetch(`${url}/inputvalues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();

    res.status(200).json(data)

  } catch (err: any) {
    console.log('err', err);
    res.status(500).json({err});
  }
}