

export async function apiTest({ cnpj, password }) {
  let auth = false;

  if (cnpj === 'teste' && password === 'password') {
    auth = true;
  }

 

  return {
    auth: auth,
  };
}
