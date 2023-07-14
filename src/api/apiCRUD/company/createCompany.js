import api from "@/api/api";

export async function createCompanyAPI({ name, cnpj, addres, phone, password }){

    const convertCnpj = parseInt(cnpj)

    const response = await api.post('http://localhost:3333/api/company/create', {
            name,
            cnpj: convertCnpj,
            addres,
            phone,
            password
    })

    console.log(response.data, password)
}