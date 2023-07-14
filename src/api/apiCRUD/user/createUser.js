import api from "@/api/api";

export async function addEmployeeAPI({ name, office, age, company, cpf }){

    await api.post('http://localhost:3333/api/user', {
            name,
            office,
            age,
            company,
            cpf
    })

}