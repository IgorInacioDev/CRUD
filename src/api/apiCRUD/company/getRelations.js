
import api  from '@/api/api.js'
import { getTokenSession } from '@/token'



export async function getRelations(){

    const { token_session } = await getTokenSession()

    const response = await api.get('http://localhost:3333/api/company/affiliated', {
    params: {
      cnpj: `${token_session}`,
    }
  })

    const fields = response.data.fields

    console.log(fields)
    
    return {
        fields
    }
}