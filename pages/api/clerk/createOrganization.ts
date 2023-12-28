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

    const { name, createdBy } = req.body;

    // Use the Clerk SDK to create a new organization
    const response = await clerkClient.organizations.createOrganization({
      name,
      createdBy,
      slug: name.toLowerCase().replace(/\s/g, '-'),
    });
    console.log('newOrg: ', response);

    res.status(200).json({response})  

  } catch (err: any) {
    console.log('err', err);
    res.status(500).json({err});
  }

}
