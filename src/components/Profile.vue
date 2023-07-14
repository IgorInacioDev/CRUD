<template>
  <div class="profile">
    <div class="profile-header">
      <div class="profile-image">
        <input type="file" ref="fileInput" style="display: none" accept="image/png" @change="handleImageUpload" />
        <img :src="profileImage" alt="Foto de Perfil" @click="openFileInput" />
      </div>
      <div class="company-info-container">
        <div class="company-info">
          <div class="info-item">
            <span class="info-label">CNPJ:</span>
            <span class="info-value">{{ cnpj }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Nome:</span>
            <span class="info-value">{{ name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Endereço:</span>
            <span class="info-value">{{ address }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Telefone:</span>
            <span class="info-value">{{ phone }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fields">
      <div class="title-container">
        <h2 class="title-style">Funcionários</h2>
        <button class="add-button" @click="openModal">
          <i class="">+</i>
        </button>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cargo</th>
              <th>Idade</th>
              <th>Cpf</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(field, index) in limitedFields" :key="index">
              <td>{{ field.name }}</td>
              <td>
                <template v-if="editingFieldIndex === index">
                  <input type="text" v-model="field.newOffice" class="modal-input" />
                </template>
                <template v-else>
                  {{ field.office }}
                </template>
              </td>
              <td>{{ field.age }}</td>
              <td>{{ field.cpf }}</td>
              <td>
                <button class="edit-button" @click="toggleEdit(index)">
                  <template v-if="editingFieldIndex === index">
                    <i class="fas fa-check"></i>
                  </template>
                  <template v-else>
                    <i class="fas fa-pencil-alt"></i>
                  </template>
                </button>
              </td>
              <td>
                <button class="delete-button" @click="deleteOrCancelEdit(index)">
                  <span class="delete-icon">&times;</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal" v-if="showModal">
      <div class="modal-dialog">
        <h3>{{ modalTitle }}</h3>
        <div class="form-group">
          <label for="name">Nome:</label>
          <input type="text" id="name" v-model="newEmployee.name" class="modal-input" readonly />
        </div>
        <div class="form-group">
          <label for="age">Idade:</label>
          <input type="number" id="age" v-model="newEmployee.age" class="modal-input" />
        </div>
        <div class="form-group">
          <label for="office">Cargo:</label>
          <input type="text" id="office" v-model="newEmployee.office" class="modal-input" />
        </div>
        <div class="form-group">
          <label for="company">Compania:</label>
          <input type="text" id="company" v-model="newEmployee.company" class="modal-input" />
        </div>
        <div class="form-group">
          <label for="cpf">CPF:</label>
          <input type="text" id="cpf" v-model="newEmployee.cpf" class="modal-input" />
        </div>
        <div class="modal-buttons">
          <button class="modal-button save-button" @click="saveEmployee">{{ modalAction }}</button>
          <button class="modal-button cancel-button" @click="cancelModal">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmação de exclusão -->
    <div class="modal" v-if="showConfirmation">
      <div class="modal-dialog">
        <h3>Confirmar Exclusão</h3>
        <p>Deseja realmente excluir o funcionário?</p>
        <div class="modal-buttons">
          <button class="modal-button save-button" @click="deleteField(selectedField)">Confirmar</button>
          <button class="modal-button cancel-button" @click="cancelConfirmation">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getProfile } from '@/api/apiCRUD/company/getProfile';
import { getRelations } from '@/api/apiCRUD/company/getRelations';
import { deteleUserCompany } from '@/api/apiCRUD/company/deteleUserCompany';
import { addEmployeeAPI } from '@/api/apiCRUD/user/createUser';
import { updateOfficeUser } from '@/api/apiCRUD/user/updateUser';

export default {
  name: 'Profile',
  data() {
    return {
      profileImage: '',
      name: '',
      address: '',
      cnpj: '',
      phone: '',
      fields: [],
      limit: 6,
      showModal: false,
      showConfirmation: false,
      newEmployee: {
        name: '',
        office: '',
        company: '',
        age: '',
        cpf: ''
      },
      selectedField: null,
      modalTitle: '',
      modalAction: '',
      selectedFieldIndex: null,
      editingFieldIndex: null,
      originalOffice: '',
    };
  },
  async mounted() {
    await getProfile()
      .then((profile) => {
        this.name = profile.name;
        this.address = profile.address;
        this.cnpj = profile.cnpj;
        this.phone = profile.phone;
        this.newEmployee.company = profile.name; // Definindo o valor inicial do campo "company" em newEmployee
      })
      .catch((error) => {
        console.error('Erro ao obter o perfil:', error);
      });

    await getRelations()
      .then((response) => {
        this.fields = response.fields.map((field) => ({
          ...field,
          isEditing: false,
          newOffice: field.office
        }));
      })
      .catch((error) => {
        console.error('Erro ao obter os funcionários:', error);
      });

    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      this.profileImage = savedImage;
    }
  },
  computed: {
    limitedFields() {
      return this.fields.slice(0, this.limit);
    },
    isEditing() {
      return this.editingFieldIndex !== null;
    },
  },
  methods: {
    openFileInput() {
      this.$refs.fileInput.click();
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file && file.type === 'image/png') {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileImage = e.target.result;
          localStorage.setItem('profileImage', e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },

    openModal() {
      this.modalTitle = 'Cadastrar Funcionário';
      this.modalAction = 'Salvar';
      this.showModal = true;
    },

    cancelModal() {
      this.showModal = false;
      this.resetModalFields();
    },

    async addEmployee() {
      await addEmployeeAPI(this.newEmployee);
      this.showModal = false;
      await this.refreshFields();
    },

    showConfirmationModal(field) {
      this.selectedField = field;
      this.showConfirmation = true;
    },

    cancelConfirmation() {
      this.selectedField = null;
      this.showConfirmation = false;
    },

    async deleteField(field) {
      await deteleUserCompany({
        cpf: field.cpf
      });
      this.fields = this.fields.filter((f) => f.cpf !== field.cpf);
      this.cancelConfirmation();
    },

    deleteOrCancelEdit(index) {
      if (this.editingFieldIndex === index) {
        this.cancelEdit();
      } else {
        this.showConfirmationModal(this.fields[index]);
      }
    },

    async saveEmployee() {
      if (this.modalAction === 'Salvar') {
        await this.addEmployee();
      } else if (this.modalAction === 'Atualizar') {
        await this.updateEmployee();
      }
    },

    async updateEmployee() {
      await updateOfficeUser(this.newEmployee);
      this.showModal = false;
      await this.refreshFields();
    },

    resetModalFields() {
      this.newEmployee = {
        name: '',
        office: '',
        company: this.name, // Definindo o valor inicial do campo "company" em newEmployee
        age: '',
        cpf: ''
      };
    },

    async refreshFields() {
      await getRelations()
        .then((response) => {
          this.fields = response.fields.map((field) => ({
            ...field,
            isEditing: false,
            newOffice: field.office
          }));
        })
        .catch((error) => {
          console.error('Erro ao obter os funcionários:', error);
        });
    },

    toggleEdit(index) {
      if (this.editingFieldIndex === index) {
        this.cancelEdit();
      } else {
        this.startEdit(index);
      }
    },

    startEdit(index) {
      this.editingFieldIndex = index;
      this.originalOffice = this.fields[index].office;
    },

    cancelEdit() {
      this.editingFieldIndex = null;
    },
  },
};
</script>


<style>
body {
  background-color: #212121;
  color: #fff;
  margin: 0;
  padding: 0;
}



.profile {
  margin-top: 10px;
  width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #fff;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.profile-image {
  margin-right: 20px;
  cursor: pointer;
}

.profile-image img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-top: 50px;
}

.company-info-container {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;
}

.company-info {
  align-items: center;
  margin-left: 74%;
  width: 250px;
  height: 150px;
  flex-shrink: 0;
  background-color: rgba(18, 18, 18, 0.84);
  padding: 10px;
  border-radius: 10px;
}

.info-item {
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  margin: 10px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
}

.info-label {
  font-weight: bold;
  margin-right: 5px;
}

.container-fields {
  width: 1200px;
  height: 600px;
  flex-shrink: 0;
  border-radius: 10px;
  background: rgba(18, 18, 18, 0.84);
  align-items: center;
}

.title-container {
  display: flex;
  align-items: center;
}

.title-style {
  padding: 20px;
  margin-left: 42%;
}

.table-container {
  max-height: 650px;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

table th,
table td {
  font-size: 18px;
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #333;
}

table th {
  font-weight: bold;
  color: #fff;
  background-color: #444;
}

table td {
  color: #fff;
}

.delete-button {
  width: 30px;
  height: 30px;
  background-color: rgb(59, 59, 59);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-left: 5px;
}

.delete-icon {
  margin-top: 2px;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.add-button {
  width: 30px;
  height: 30px;
  background-color: rgb(59, 59, 59);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
  margin-left: 33.5%;
  cursor: pointer;
}

.add-button i {
  margin-top: 3px;
  color: white;
  font-size: 20px;
  font-weight: bold;
}

/* CSS do pop-up de cadastro */

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
}

.modal p {
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.modal-button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}

.modal-button.cancel-button {
  background-color: #af2525;
  color: #fff;
  font-size: 20px;
}

.modal-button.save-button {
  background-color: rgb(24, 24, 24);
  color: #fff;
  font-size: 20px;
}


.edit-button {
  width: 30px;
  height: 30px;
  background-color: rgb(59, 59, 59);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-left: 5px;
}

.edit-button i {
  color: white;
  font-size: 16px;
}

.save-button {
  padding: 5px 10px;
  border-radius: 5px;
  background-color: rgb(59, 59, 59);
  color: white;
  font-size: 12px;
  border: none;
  cursor: pointer;
  margin-top: 5px;
}

.modal-input[disabled] {
  background-color: #333;
  color: #fff;
}



</style>