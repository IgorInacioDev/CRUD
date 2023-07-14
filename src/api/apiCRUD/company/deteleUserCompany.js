import api from "@/api/api";

export async function deteleUserCompany({ cpf }){


   await api.delete('http://localhost:3333/api/user', {
    params: {
        cpf,
    }
            
    })

}