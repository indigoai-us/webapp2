import authedFetch from "./authedFetch";

const finishAccount = async ({clerkUser, organization, membership, getToken}: any) => {
	console.log('clerk user: ', clerkUser);
	console.log('organization: ', organization);
	console.log('membership: ', membership);   

	try {
		const newUser = {
			email: clerkUser?.primaryEmailAddress?.emailAddress,
			first_name: clerkUser?.firstName,
			last_name: clerkUser?.lastName,
			sub: clerkUser?.id,
			admin: true
		}

		const userResponse = await fetch(`/api/users/post`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newUser)
		});
		const userData = await userResponse.json();

		console.log('user data: ', userData);
		
		const newCompany = {
			name: organization?.name,
			sub: organization?.id,
			users: [userData._id]
		}

		const gotCompanies = await authedFetch(`/companies?sub=${organization?.id}`, 'GET', null, getToken);
		console.log('got companies: ', gotCompanies);      

		const postNewCompany = async() => {
			const companyResponse = await fetch(`/api/companies/post`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newCompany)
			});
			const companyData = await companyResponse.json();
	
			console.log('company data: ', companyData);
			return companyData;
		}

		const company = gotCompanies?.data[0] || await postNewCompany();
		const companyId = company._id;

		const newUserData = {
			...userData,
			company: companyId,
			admin: membership?.role === 'org:member' ? false : true,
			teams: []
		}

		console.log('new user data: ', newUserData);		

		const updatedUserResponse = await fetch(`/api/users/put`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newUserData)
		});
		const updatedUser = await updatedUserResponse.json();
		
		console.log('updated user: ', updatedUser);

		if(gotCompanies?.data[0]) {
			const newCompany = {
				...gotCompanies?.data[0],
				users: [
					...gotCompanies?.data[0].users.map((user: any) => user._id),
					updatedUser._id
				]
			}
			delete newCompany._id;
			delete newCompany.createdAt;
			delete newCompany.updatedAt;

			console.log('new company: ', newCompany);        

			const updatedCompany = await authedFetch(`/companies/${gotCompanies?.data[0]?._id}`, 'PUT', newCompany, getToken);
			
			console.log('updated company: ', updatedCompany);
		}

		const returnUser = {
			...updatedUser,
			company
		}

		return returnUser;
		
	} catch (err: any) {
		console.log('error: ', err);      
		return err;
	}
}

export default finishAccount;