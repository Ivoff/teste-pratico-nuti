<template>
    <div>
        <b-container class="text-center" :key="componentKey">
            <div style="height: 100px">
                <b-alert
                :show="dismissCountDown"
                dismissible
                :variant="submitResult"
                @dismissed="dismissCountDown=0"
                @dismiss-count-down="countDownChanged"
                >
                    {{submitMessage}}
                    <b-progress
                        :variant="submitResult"
                        :max="dismissSecs"
                        :value="dismissCountDown"
                        height="4px"
                    ></b-progress>
                </b-alert>            
            </div>            
            <b-form @submit="onSubmit">
                <b-form-group                
                label="Cidade:"
                label-align-sm="left"
                label-for="city-name"                
                >
                    <b-form-input
                        id="city-name"
                        v-model="toSaveCity.name"
                        placeholder="Nome da cidade"                        
                    ></b-form-input>
                </b-form-group>                
                <b-button block type="sumbit" variant="success">Save</b-button>
            </b-form>
            <b-table class="mt-5" striped hover :items="cities" :fields="fields" :busy="loading">
                <template #table-busy>
                    <div class="text-center text-info my-2">
                        <b-spinner class="align-middle"></b-spinner>
                        <strong>Loading...</strong>
                    </div>
                </template>
                <template #cell(actions)="data">                                            
                    <b-button class="mr-3" variant="info" @click="loadCity(data.item)">update</b-button>            
                    <b-button variant="danger" @click="deleteCity(data.item)">delete</b-button>                                            
                </template>
            </b-table>
        </b-container>        
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "City",
        components: {},
        data() {
            return {
                componentKey: 0,
                fields: [
                    'id',
                    'name',
                    'actions'
                ],
                cities: [],
                toSaveCity: {
                    id: null,
                    name: ''
                },
                loading: false,
                dismissSecs: 5,
                dismissCountDown: 0,
                submitResult: null,
                submitMessage: null,                
            }
        },
        methods: {
            async deleteCity(cityObj) {
                this.loading = true;
                const { data } = await axios({
                    method: 'get',
                    url: `${this.$DOMAIN}${this.$PORT}/city/delete/${cityObj.id}`
                });
                this.postRequestMessage(data, 'Cidade deletada com sucesso');
                this.fetchCities();
            },
            async fetchCities() {
                
                const { data } = await axios({
                    method: 'get',
                    url: `${this.$DOMAIN}${this.$PORT}/city/all`
                });            
                if (data.status) {                
                    this.cities = data.data;
                } else {
                    alert(data.message ?? "Algo de errado aconteceu");
                }                
            },
            async loadCity(cityObj) {
                this.toSaveCity.id = cityObj.id;
                this.toSaveCity.name = cityObj.name;    
            },
            async onSubmit(event) {
                event.preventDefault();
                this.loading = true;                
                const { data } = await axios({
                    method: 'post',
                    url: `${this.$DOMAIN}${this.$PORT}/city/create`,
                    data: {...this.toSaveCity}
                });                
                this.postRequestMessage(data ,'Cidade salva com sucesso!');
                this.fetchCities();
            },
            countDownChanged(dismissCountDown) {
                this.dismissCountDown = dismissCountDown
            },
            showAlert() {
                this.dismissCountDown = this.dismissSecs
            },
            postRequestMessage(data, successMessage) {
                this.loading = false;
                this.toSaveCity.id = null;
                this.toSaveCity.name = '';
                if (data.status) {
                    this.submitResult = 'success';
                    this.submitMessage = successMessage;
                    this.showAlert();
                } else {
                    this.submitResult = 'warning';
                    this.submitMessage = data.message;
                    this.showAlert();
                }
            }
        },
        async created() {
            this.fetchCities();
        }
    }
</script>

<style>

</style>