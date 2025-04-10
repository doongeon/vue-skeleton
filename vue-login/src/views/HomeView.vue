<script setup>
import { getUserInfo, logoutProcess } from '../../../src/utils/AuthUtils';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';

const router = useRouter();
const data = reactive({userInfo:getUserInfo()})
const logout = ()=>{
  logoutProcess(()=> {
    data.userInfo = {};
    router.push({name: 'home'})
  })
}

</script>

<template>
  <div>hello</div>
  <div v-if="data.userInfo.authenticated">
    <p> {{ data.userInfo.userid }} </p>
    <p> [{{ data.userInfo.roles.join(',') }}]</p>
    <button @click="logout" type="button" class="btn btn-primary w-100">로그아웃</button>
  </div>
</template>

<style scoped></style>
