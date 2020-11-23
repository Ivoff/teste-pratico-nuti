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
                label="Avião:"
                label-align-sm="left"
                label-for="plane-name"                
                >
                    <b-form-input
                        id="plane-name"
                        v-model="toSavePlane.name"
                        placeholder="Nome do aviao"                        
                    ></b-form-input>
                </b-form-group>                
                <b-button block type="sumbit" variant="success">Save</b-button>
            </b-form>
            <b-table class="mt-5" striped hover :items="planes" :fields="fields" :busy="loading">
                <template #table-busy>
                    <div class="text-center text-info my-2">
                        <b-spinner class="align-middle"></b-spinner>
                        <strong>Loading...</strong>
                    </div>
                </template>
                <template #cell(actions)="data">                                            
                    <b-button class="mr-3" variant="info" @click="loadPlane(data.item)">update</b-button>            
                    <b-button variant="danger" @click="deletePlane(data.item)">delete</b-button>                                            
                </template>
            </b-table>
        </b-container>        
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "Plane",
        components: {},
        data() {
            return {
                componentKey: 0,
                fields: [
                    'id',
                    'name',
                    'actions'
                ],
                planes: [],
                toSavePlane: {
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
            async deletePlane(planeObj) {
                this.loading = true;
                const { data } = await axios({
                    method: 'get',
                    url: `${this.$DOMAIN}${this.$PORT}/plane/delete/${planeObj.id}`
                });
                this.postRequestMessage(data, 'Aviao deletado com sucesso');
                this.fetchPlanes();                
            },
            async fetchPlanes() {
                const { data } = await axios({
                    method: 'get',
                    url: `${this.$DOMAIN}${this.$PORT}/plane/all`
                });            
                if (data.status) {                
                    this.planes = data.data;
                } else {
                    alert(data.message ?? "Algo de errado aconteceu");
                }                
            },
            async loadPlane(planeObj) {
                this.toSavePlane.id = planeObj.id;
                this.toSavePlane.name = planeObj.name;    
            },
            async onSubmit(event) {
                event.preventDefault();
                this.loading = true;                
                const { data } = await axios({
                    method: 'post',
                    url: `${this.$DOMAIN}${this.$PORT}/plane/create`,
                    data: {...this.toSavePlane}
                });                
                this.postRequestMessage(data ,'Avião salvo com sucesso!');
                this.fetchPlanes();
            },
            countDownChanged(dismissCountDown) {
                this.dismissCountDown = dismissCountDown
            },
            showAlert() {
                this.dismissCountDown = this.dismissSecs
            },
            postRequestMessage(data, successMessage) {
                this.loading = false;
                this.toSavePlane.id = null;
                this.toSavePlane.name = '';
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
            this.fetchPlanes();
        }
    }
</script>

<style>

</style>