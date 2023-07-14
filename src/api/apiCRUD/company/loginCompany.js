import api from "@/api/api";
import { setTokenSession } from "@/token";



export async function loginCompanyAPI({ cnpj, password }){

    const convertCnpj = parseInt(cnpj)


    const response = await api.post('http://localhost:3333/api/company/login', {
            cnpj: convertCnpj,
            password
    })

    await setTokenSession(cnpj)

    console.log(response.data)

    return {
        auth: true
    }
}