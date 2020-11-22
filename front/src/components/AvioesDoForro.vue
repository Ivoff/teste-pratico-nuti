<template>
    <div class="container">
        <div class="center">
            <img src="../assets/avioes.png">            
        </div>        
    </div>
</template>

<script>
export default {
    name: "AvioesDoForro",
    components: {},
    data() {
        return {

        }
    }    
}
</script>

<style scoped>
    .container {
        height: 80%;
        position: relative;        
    }
    .center {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;        
        transform: translate(-50%, -50%);
    }
    img {
        width: 75%;
    }
</style>