<template>
    <div>
        <b-navbar type="dark" variant="dark">            
            <b-row>
                <b-col v-for="route in routes" :key="route.path" >
                    <b-nav-item :to="route.path" >{{route.name}}</b-nav-item>                        
                </b-col>
            </b-row>
        </b-navbar>
    </div>
</template>

<script>
export default {
    name:'CustomNavBar',
    components:{},
    props: ['m_routes'],
    data() {
        return {
            routes: this.m_routes
        }
    }
}
</script>

<style scoped>    
    a {
        color: white;
    }
</style>