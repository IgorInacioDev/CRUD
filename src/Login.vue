<template>
  <div id="app">
    <div class="login-container">
      <h1 class="login-title">Affiliate control</h1>
      <form class="login-form" @submit.prevent="submitForm">
        <input v-model="cnpj" type="text" placeholder="CNPJ" required />
        <input v-model="password" type="password" placeholder="Senha" required />
        <button type="submit">Enviar</button>
      </form>
      <div class="register-option">
        Novo aqui? <a href="#" @click="openModal">Cadastre-se!</a>
      </div>
    </div>

    <div class="modal" v-if="showModal">
      <div class="modal-dialog">
        <h3>Cadastrar Empresa</h3>
        <div class="form-group">
          <label for="registerCnpj">CNPJ:</label>
          <input type="text" id="registerCnpj" v-model="registerCnpj" class="modal-input" />
        </div>
        <div class="form-group">
          <label for="registerName">Nome:</label>
          <input type="text" id="registerName" v-model="registerName" class="modal-input" />
        </div>
        <div class="form-group">
          <label for="registerAddress">Endereço:</label>
          <input type="text" id="registerAddress" v-model="registerAddress" class="modal-input" />
        </div>
        <div class="form-group">
          <label for="registerPhone">Telefone:</label>
          <input type="text" id="registerPhone" v-model="registerPhone" class="modal-input" />
        </div>
        <div class="form-group">
          <label for="registerPassword">Senha:</label>
          <input type="password" id="registerPassword" v-model="registerPassword" class="modal-input" />
        </div>
        <div class="modal-buttons">
          <button class="modal-button cancel-button" @click="cancelModal">Cancelar</button>
          <button class="modal-button save-button" @click="registerCompany">Cadastrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getProfile } from '@/api/apiCRUD/company/getProfile';
import { loginCompanyAPI } from './api/apiCRUD/company/loginCompany.js'
import { createCompanyAPI } from '@/api/apiCRUD/company/createCompany.js'

export default {
  name: 'Login',
  data() {
    return {
      cnpj: '',
      password: '',
      showModal: false,
      registerCnpj: '',
      registerName: '',
      registerAddress: '',
      registerPhone: '',
      registerPassword: ''
    };
  },
  methods: {
    async submitForm() {
      const response = await loginCompanyAPI({
        cnpj: this.cnpj,
        password: this.password
      })

      if (response.auth) {
        this.message = 'Login realizado com sucesso.';
        this.submitted = true;
        this.authenticated = true;
        await getProfile()
        
        // Redirecionar para a rota "/profile"
        this.$router.push('/profile');
      } else {
        this.message = 'Erro ao fazer login. Verifique suas credenciais.';
        this.authenticated = false;
      }
    },
    openModal() {
      this.showModal = true;
    },
    cancelModal() {
      this.showModal = false;
      this.resetRegisterForm();
    },
    async registerCompany() {
      const companyData = {
        cnpj: this.registerCnpj,
        name: this.registerName,
        addres: this.registerAddress,
        phone: this.registerPhone,
        password: this.registerPassword
      };

      await createCompanyAPI(companyData);
      this.cancelModal();
      // Implementar a lógica de redirecionamento para a página de perfil ou de login
    },
    resetRegisterForm() {
      this.registerCnpj = '';
      this.registerName = '';
      this.registerAddress = '';
      this.registerPhone = '';
      this.registerPassword = '';
    }
  }
};
</script>

<style >
body {
  background-color: #2A2A2A;
  color: #fff;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
}

.login-container {
  max-width: 335px;
  height: 409px;
  margin: 0 auto;
  margin-top: 10%;
  padding: 40px;
  border-radius: 10px;
  background: rgba(18, 18, 18, 0.84);
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-weight: bold;
}

input {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
  border-radius: 10px;
  background: #3D3D3D;
  color: #fff;
  border: none;
  padding: 0 10px;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
}

button {
  margin-top: 99px;
  width: 100%;
  height: 60px;
  margin-bottom: 20px;
  border-radius: 10px;
  background: #D9D9D9;
  color: #333;
  font-weight: bold;
  border: none;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 20px;
}

button:hover {
  background-color: #ddd;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
}

.register-option {
  color: #414141;
  text-align: center;
  margin-top: 20px;
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
}

.modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(18, 18, 18, 0.84);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.modal-dialog {
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
}

.modal h3 {
  margin-top: 0;
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
}

.modal p {
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
}

.modal-button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-left: 10px;
}

.modal-button.cancel-button {
  background-color: #999;
  color: #fff;
  font-size: 20px;
}

.modal-button.save-button {
  background-color: rgb(82, 151, 61);
  color: #fff;
  font-size: 20px;
}

.modal-input {
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  border-radius: 5px;
  background: #3D3D3D;
  color: #fff;
  border: none;
  padding: 0 10px;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
}
</style>