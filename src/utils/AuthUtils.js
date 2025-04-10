const staticUsers = [
    {userid: "user1", password: "1234", roles: ["users"]},
    {userid: "user2", password: "1234", roles: ["users"]},
    {userid: "admin", password: "0000", roles: ["users", "admins"]},
]

const pathsToRoles = [
    { path: '/', roles: ['everybody'] },               // layout 페이지 (기본 layout wrapper)
    { path: '/login', roles: ['everybody'] },          // 로그인 페이지
    { path: '/main', roles: ['users', 'admins'] },     // 메인 홈
    { path: '/main/history', roles: ['users', 'admins'] },
    { path: '/main/history/add', roles: ['users', 'admins'] },
    { path: '/main/history/:id', roles: ['users', 'admins'] },
    { path: '/main/history/:id/edit', roles: ['users', 'admins'] },
    { path: '/main/analysis', roles: ['users', 'admins'] },
    { path: '/main/calendar', roles: ['users', 'admins'] },
    { path: '/main/profile', roles: ['users', 'admins'] },
    { path: '/sidebar', roles: ['users', 'admins'] },
    { path: '/admin', roles: ['admins'] }, // (향후 관리자용 페이지 대비)
    { path: '/:pathMatch(.*)*', roles: ['everybody'] }, // not found도 everyone
  ]

// userInfo가 null이면 로컬 스토리지 삭제
const setUserInfo = (userInfo) => {
    if (userInfo && userInfo.authenticated) {
        window.localStorage.setItem("userInfo", btoa(JSON.stringify(userInfo))) // 로컬은 문자열만: 객체 -> json 문자열 -> base4 인코딩(ASCII)
    } else {
        window.localStorage.removeItem("userInfo")
    }
}

const getUserInfo = () => { 
    const strUserInfo = window.localStorage.getItem("userInfo");
    if (!strUserInfo) {
        return {authenticated: false};
    } else {
        return JSON.parse(window.atob(strUserInfo));
    }
}

const loginProcess = (userid, password, successCallback, failCallback) => {
    // 이 부분은 백엔드 API 인증 서버와 HTTP로 통신해 인증처리 필요
    const user = staticUsers.find((u)=> u.userid === userid && u.password === password);
    if (user) {
        let userInfo = {authenticated: true, userid: user.userid, roles: user.roles};
        setUserInfo(userInfo);
        successCallback();
    } else {
        if (failCallback) failCallback();
    }
}

const logoutProcess = (callback) => {
    setUserInfo(null); // delete localStorage
    callback();
}

// 경로와 사용자 정보의 role을 기반으로 접근 허가 여부 결정(boolean)
const isMatchToRoles = (reqPath) => {
    // {path:"/", roles: ["everybody"]},
    const path = pathsToRoles.find((pr) => pr.path == reqPath)
    // 경로 없으면 접근 불가
    if (!path) return false;

    const userInfo = getUserInfo();
    
    // 인증되지 않은 사용자는 everybody
    if (userInfo.authenticated === false) {
        return path.roles.find((p) => p=== "everybody") ? true : false;
    } else {
        let isAccessible = false;
        // everybody가 존재한다면
        if (path.roles.indexOf('everybody') > -1){ 
            isAccessible = true;
        } else {
            // everybody 접근 허용이 안된 path라면
            for (let i=0; i<userInfo.roles.length; i++){
                let role = userInfo.roles[i];
                const index = path.roles.indexOf(role);
                if (index >= 0) {
                    isAccessible = true;
                    break;
                }
            }
        }
        return isAccessible;
    }
}

export { isMatchToRoles, loginProcess, logoutProcess, getUserInfo};
