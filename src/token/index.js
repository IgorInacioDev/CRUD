let token_session = '';

export async function setTokenSession(token) {
  token_session = token;

  console.log(token_session)

}

export async function getTokenSession() {
  return {
    token_session
};
}
