<template>
	<div id="flight">         		
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
					label-for="flight-plane"
				>
					<v-select id="flight-plane" v-model="toSaveFlight.plane" :options="planes" :getOptionLabel="option => option.name">
						<template #option="{ id, name }">							
							<b>{{ name }}</b>
							<br />
							<small style="color: #808080">cod {{ id }}</small>
						</template>
					</v-select>
				</b-form-group>
				
				<b-row>
					<b-col>
						<b-form-group							
							label="Cidade de Origem:"
							label-align-sm="left"
							label-for="flight-city-origin"
						>
							<v-select id="flight-city-origin" v-model="toSaveFlight.city_origin" :options="cities" :getOptionLabel="option => option.name">
								<template #option="{ id, name }">							
									<b>{{ name }}</b>
									<br />
									<small style="color: #808080">cod {{ id }}</small>
								</template>
							</v-select>
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group							
							label="Cidade de Destino:"
							label-align-sm="left"
							label-for="flight-city-destiny"
						>
							<v-select id="flight-city-destiny" v-model="toSaveFlight.city_destiny" :options="cities" :getOptionLabel="option => option.name">
								<template #option="{ id, name }">							
									<b>{{ name }}</b>
									<br />
									<small style="color: #808080">cod {{ id }}</small>
								</template>
							</v-select>
						</b-form-group>
					</b-col>
				</b-row>
				<b-row>
					<b-col>
						<b-form-group
							label="Data de Decolagem:"
							label-align-sm="left"
							label-for="flight-date"
						>
							<b-form-datepicker id="flight-date" v-model="date"></b-form-datepicker>
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group
							label="Hora de Decolagem:"
							label-align-sm="left"
							label-for="flight-time"
						>
							<b-form-timepicker id="flight-time" v-model="time" locale="en"></b-form-timepicker>
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group
							label="Duração do Voo:"
							label-align-sm="left"
							label-for="flight-duration"
						>
							<b-form-input id="flight-duration" v-model="toSaveFlight.duration" type="number" min="1"></b-form-input>
						</b-form-group>
					</b-col>
				</b-row>				
				<b-button type="sumbit" block variant="success">Save</b-button>				
			</b-form>

			<b-table class="mt-5" striped hover :items="flights" :fields="fields" :busy="loading">
                <template #table-busy>
                    <div class="text-center text-info my-2">
                        <b-spinner class="align-middle"></b-spinner>
                        <strong>Loading...</strong>
                    </div>
                </template>
				<template #cell(plane)="data">  
					{{findInMemory(data.item.plane, 'plane').name}} 
					<small style="color: #808080;"># {{data.item.plane}}</small>
				</template>
				<template #cell(duration)="data">  
					{{data.value}} hours
				</template>
				<template #cell(city_origin)="data">  
					{{findInMemory(data.item.city_origin, 'city').name}} 
					<small style="color: #808080;"># {{data.item.city_origin}}</small>
				</template>
				<template #cell(city_destiny)="data">  
					{{findInMemory(data.item.city_destiny, 'city').name}} 
					<small style="color: #808080;"># {{data.item.city_destiny}}</small>
				</template>
                <template #cell(actions)="data">                                            
                    <b-button class="mr-3" variant="info" @click="loadFlight(data.item)">update</b-button>            
                    <b-button variant="danger" @click="deleteFlight(data.item)">delete</b-button>                                            
                </template>
            </b-table>
		</b-container>
	</div>
</template>

<script>
	
	import axios from 'axios'	

	export default {
		name: 'Flight',
		components: {			
		},
		data() {
			return {
				componentKey: 0,
				flights: [],
				fields: [
                    { key: 'id', label: 'Id' },
					{ key: 'plane', label: 'Plane' },
					{ key: 'city_origin', label: 'Origin City' },
					{ key: 'city_destiny', label: 'Destiny City' },
					{ key: 'date', label: 'Date' },
					{ key: 'duration', label: 'Duration' },
					{ key: 'actions', label: 'Actions' },
                ],
				cities: [],
				planes: [],
				date: "",
				time: "",
				toSaveFlight: {
					id: null,
					plane: {},
					city_origin: {},
					city_destiny: {},
					date: "",
					duration: 0,
				},
				loading: false,
				dismissSecs: 5,
                dismissCountDown: 0,
                submitResult: null,
                submitMessage: null           
			}
		},
		methods: {
			loadFlight(flightObj) {				
				this.toSaveFlight.id = flightObj.id;
				this.toSaveFlight.plane = {
					id: this.findInMemory(flightObj.plane, 'plane').id,					
					name: this.findInMemory(flightObj.plane, 'plane').name,
				};
				this.toSaveFlight.city_origin = {
					id: this.findInMemory(flightObj.city_origin, 'city').id,
					name: this.findInMemory(flightObj.city_origin, 'city').name,
				};
				this.toSaveFlight.city_destiny = {
					id: this.findInMemory(flightObj.city_destiny, 'city').id,
					name: this.findInMemory(flightObj.city_destiny, 'city').name,
				};
				this.toSaveFlight.date = flightObj.date;
				this.date = flightObj.date.split(" ")[0];
				this.time = flightObj.date.split(" ")[1];
				this.toSaveFlight.duration = flightObj.duration;
			},
			async deleteFlight(flightObj) {
				this.loading = true;
                const { data } = await axios({
                    method: 'get',
                    url: `${this.$DOMAIN}${this.$PORT}/flight/delete/${flightObj.id}`
                });
                this.postRequestMessage(data, 'Voo deletado com sucesso');
                this.fetchOnlyFlights();
			},
			findInMemory(id, type) {				
				if (type === 'plane') {
					return this.planes.find(element => element.id == id);
				} else {
					return this.cities.find(element => element.id == id);
				}				
			},
			async fetchAll() {								
				result = await axios({
					method: 'get',
					url: `${this.$DOMAIN}${this.$PORT}/city/all`
				});				
				if (result.data.status) {                
                    this.cities = result.data.data;
                } else {
                    alert(result.data.message ?? "Algo de errado aconteceu durante a busca de cidades");
				}

				result = await axios({
					method: 'get',
					url: `${this.$DOMAIN}${this.$PORT}/plane/all`
				});				
				if (result.data.status) {                
                    this.planes = result.data.data;
                } else {
                    alert(result.data.message ?? "Algo de errado aconteceu durante a busca de avioes");
				}

				let result = await axios({
					method: 'get',
					url: `${this.$DOMAIN}${this.$PORT}/flight/all`
				});				
				if (result.data.status) {                
                    this.flights = result.data.data;
                } else {
                    alert(result.data.message ?? "Algo de errado aconteceu durante a busca de voos");
				}				
			},
			async onSubmit(event) {
				event.preventDefault();
				this.loading = true;
				this.toSaveFlight.date = `${this.date} ${this.time}`;
				const {data} = await axios({
					method: 'post',
					url: `${this.$DOMAIN}${this.$PORT}/flight/create`,
					data: {...this.toSaveFlight}
				});
				this.loading = false;
				this.resetFormAndModel();								
				this.postRequestMessage(data ,'Voo salvo com sucesso!');
				this.fetchAll();
			},
			async fetchOnlyFlights() {
				const {data} = await axios({
					method: 'get',
					url: `${this.$DOMAIN}${this.$PORT}/flight/all`,					
				});
				if (data.status) {                
                    this.flights = data.data;
                } else {
                    alert(data.message ?? "Algo de errado aconteceu durante a busca de voos");
				}				
			},
			resetFormAndModel() {
				this.toSaveFlight.id = null;
				this.toSaveFlight.plane = {};
				this.toSaveFlight.city_origin = {};
				this.toSaveFlight.city_destiny = {};
				this.toSaveFlight.date = '';
				this.toSaveFlight.duration = 0;
				this.time = '';
				this.date = '';
			},
			postRequestMessage(data, successMessage) {		
				this.loading = false;		
                if (data.status) {
                    this.submitResult = 'success';
                    this.submitMessage = successMessage;
                    this.showAlert();
                } else {
                    this.submitResult = 'warning';
                    this.submitMessage = data.message;
                    this.showAlert();
                }            
			},
			showAlert() {
                this.dismissCountDown = this.dismissSecs
			},
			countDownChanged(dismissCountDown) {
                this.dismissCountDown = dismissCountDown
            },
		},
		created() {			
			this.fetchAll();
		}
	}
</script>

<style>

</style>