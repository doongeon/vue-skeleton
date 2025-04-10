<script setup>
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { loginProcess } from '@/utils/AuthUtils';


const router = useRouter()
const currentRoute = useRoute()
const fromName = currentRoute.query.fromname;

const info =reactive({userid:"", password:""})

const successCallback = () => {
  if (fromName) router.push({path: fromName})
  else router.push({name: 'home'})
}

const failCallback= ()=>{
  alert('로그인 실패');
}

const login = ()=> {
  loginProcess(info.userid, info.password, successCallback, failCallback);
}

</script>

<template>
  <div class="container mt-5" style="max-width: 400px">
    <h3 class="mb-4 text-center">로그인</h3>
    
    <form @submit.prevent="login">
      <div class="mb-3">
        <label for="userid" class="form-label">아이디</label>
        <input type="text" id="userid" name="userid" v-model="info.userid" 
        class="form-control" required/>
      </div>

      <div class="mb-3">
        <label for="userpassword" class="form-label">비밀번호</label>
        <input
          type="password"
          id="userpassword"
          name="userpassword"
          v-model="info.password"
          class="form-control"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary w-100">로그인</button>
    </form>
  </div>
</template>

<style scoped>

</style>
