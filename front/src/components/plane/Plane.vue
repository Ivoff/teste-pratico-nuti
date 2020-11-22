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
            <b-form inline @submit="onSubmit">
                <label for="plane-name">Name</label>                
                <b-form-input
                    id="plane-name"
                    v-model="toSavePlane.name"                    
                    required
                    placeholder="Digite o nome do novo avião"
                ></b-form-input>                           
                <b-button type="sumbit" variant="primary">Save</b-button>
            </b-form>
            <b-table striped hover :items="planes" :fields="fields" :busy="loading">
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
                    url: `${process.env.VUE_APP_BASE_URL}${process.env.VUE_APP_PORT}/plane/delete/${planeObj.id}`
                });
                this.posRequestMessage(data, 'Aviao deletado com sucesso');
                this.fetchPlanes();
            },
            async fetchPlanes() {
                const { data } = await axios({
                    method: 'get',
                    url: `${process.env.VUE_APP_BASE_URL}${process.env.VUE_APP_PORT}/plane/all`
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
                    url: `${process.env.VUE_APP_BASE_URL}${process.env.VUE_APP_PORT}/plane/create`,
                    data: {...this.toSavePlane}
                });                
                this.posRequestMessage(data ,'Avião salvo com sucesso!');
                this.fetchPlanes();
            },
            countDownChanged(dismissCountDown) {
                this.dismissCountDown = dismissCountDown
            },
            showAlert() {
                this.dismissCountDown = this.dismissSecs
            },
            posRequestMessage(data, successMessage) {
                this.loading = false;
                this.toSavePlane.id = null;
                this.toSavePlane.name = '';
                if (data.status) {
                    this.submitResult = 'success';
                    this.submitMessage = successMessage;
                    this.showAlert();
                } else {
                    this.submitResult = 'waning';
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