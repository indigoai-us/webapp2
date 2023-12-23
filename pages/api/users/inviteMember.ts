// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { clerkClient } from '@clerk/nextjs';

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

    const { emailAddress, organizationId, role, inviterUserId, redirectUrl } = req.body;

    const invitedClerkMember = await clerkClient.organizations.createOrganizationInvitation({
      organizationId,
      emailAddress,
      inviterUserId,
      //@ts-ignore
      role,
      redirectUrl: 'http://localhost:3000/invite-accepted'
    })

    console.log('invitedClerkMember: ', invitedClerkMember);    

    res.status(200).json({name: 'John Doe'})  

  } catch (err: any) {
    console.log('err', err.errors);
    res.status(500).json({err});
  }

}
