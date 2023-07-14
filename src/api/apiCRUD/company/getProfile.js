
import api  from '@/api/api.js'
import { getTokenSession } from '@/token'



export async function getProfile(){

  const { token_session } = await getTokenSession()

    const response = await api.get('http://localhost:3333/api/company/profile', {
    params: {
      cnpj: `${token_session}`,
    }
  })
    const name = response.data.company.name
    const addres = response.data.company.addres
    const cnpj = response.data.company.cnpj
    const phone = response.data.company.phone
    
    

    return {
        name,
        addres,
        cnpj, 
        phone
    }
}