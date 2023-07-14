import api from "@/api/api";

export async function updateOfficeUser({ office, cpf }) {
  try {
    await api.patch("http://localhost:3333/api/user/update", {
      cpf: `${cpf}`,
      office,
    });
    console.log("Cargo atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar cargo:", error);
  }
}
