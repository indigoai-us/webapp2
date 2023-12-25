// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { clerkClient } from '@clerk/nextjs';

type Data = {
  name?: string,
  id?: string,
  err?: Object,
  response?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  try {  

    const getResponse = await fetch(`https://api.clerk.com/v1/sign_in_tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      body: JSON.stringify(req.body)
    });
    const response = await getResponse.json();

    res.status(200).json({response})  

  } catch (err: any) {
    console.log('err', err);
    res.status(500).json({err});
  }

}
