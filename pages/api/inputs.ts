// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
const url = process.env.NODE_ENV === 'development' 
            ? 'http://localhost:8080' 
            : 'https://indigo-api-dev.diffuze.ai';

type Data = {
  name?: string,
  id?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { method } = req;
  console.log('method:', method);

  const {id} = req.query;
  console.log('id:', id);
  console.log('req.body:', req.body);
  

  switch (method) {
    case "GET":

      if(id) {
        const getResponse = await fetch(`${url}/inputs/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const gotData = await getResponse.json();
  
        res.status(200).json(gotData)  
      }

      if(!id) {
        const getResponse = await fetch(`${url}/inputs`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const gotData = await getResponse.json();
  
        res.status(200).json(gotData)  
      }
      break;
    case "POST":

      const response = await fetch(`${url}/inputs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();

      res.status(200).json(data)
      break;
    case "PUT":

      const putId = req.body._id;
      
      const putResponse = await fetch(`${url}/inputs/`+putId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
      const putData = await putResponse.json();

      res.status(200).json(putData)
      break;
    case "DELETE":

      const deleteResponse = await fetch(`${url}/inputs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const deletedData = await deleteResponse.json();

      const {_id} = deletedData;

      res.status(200).json({ id: _id });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }

}
