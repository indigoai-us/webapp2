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
    console.log('emailAddress: ', emailAddress);
    console.log('organizationId: ', organizationId);
    console.log('role: ', role);
    console.log('inviterUserId: ', inviterUserId);
    console.log('redirectUrl: ', redirectUrl);    

    const invitedClerkMember = await clerkClient.organizations.createOrganizationInvitation({
      organizationId: 'org_2ZZATRXeihpSJuCtv47HbcDyc6V',
      emailAddress: 'bohemianhw@gmail.com',
      inviterUserId: 'user_2ZYyxYFAtW6HIQpn4MzVHXCFLGO',
      role: 'basic_member',
      redirectUrl: 'http://localhost:3000/invite-accepted'
    })

    console.log('invitedClerkMember: ', invitedClerkMember);    

    res.status(200).json({name: 'John Doe'})  

  } catch (err: any) {
    console.log('err', err.errors);
    res.status(500).json({err});
  }

}
