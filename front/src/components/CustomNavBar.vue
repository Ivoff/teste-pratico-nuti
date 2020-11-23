<template>
    <div>
        <b-navbar type="dark" variant="dark">            
            <b-navbar type="dark" variant="dark">
                <b-navbar-nav>
                    <b-nav-item class="mr-5" v-for="route in routes" :key="route.path" :to="route.path">{{route.name}}</b-nav-item>
                </b-navbar-nav>
            </b-navbar>                
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