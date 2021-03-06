
import axios from 'axios'
import {getRedirectPath} from '../util'
const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
const LOGIN_SUCESS = 'LOGIN_SUCESS'
const ERROR_MSG = 'ERROR_MSG'
const LOAD_DATA = 'LOAD_DATA'
const initState={
	redirectTo:'',
	isAuth:false,
	msg:'',
	user:'',
	type:'',
	title:''
}
// reducer
export function user(state=initState, action){
	switch(action.type){
		case REGISTER_SUCCESS:
			return {...state, msg:'',redirectTo:getRedirectPath(action.payload),isAuth:true,...action.payload}
		case LOGIN_SUCESS:
			return {...state, msg:'',redirectTo:getRedirectPath(action.payload),isAuth:true,...action.payload}
		case LOAD_DATA:
			return {...state, ...action.payload}
		case ERROR_MSG:
			return {...state, isAuth:false, msg:action.msg}
		default:
			return state
	}
} 

function registerSuccess(data){
	return { type:REGISTER_SUCCESS, payload:data}
}
function loginSuccess(data){
	return { type:LOGIN_SUCESS , payload:data}
}
function errorMsg(msg){
	return { msg, type:ERROR_MSG }
}

export function loadData(userinfo){
	console.log(loadData)
	return { type:LOAD_DATA, payload:userinfo}
}
export function login({user,pwd}){
	if (!user||!pwd) {
		return errorMsg('UserName or Password cannnot be empty !')
	}
	return dispatch=>{
		let returnUser = {
			password:pwd,
			phone:user
		}
		// dispatch(loginSuccess(returnUser))
		axios.post('/user/login',returnUser)
			.then(res=>{
				if (res.status==200) {
					if(res.data){
						sessionStorage.setItem("phone",user)
						localStorage.setItem('userId', res.data.id);
						sessionStorage.setItem("type",res.data.type)
						dispatch(loginSuccess(res.data))
					}else {
						dispatch(errorMsg("User name or password is wrong !"))
					}
					
					// dispatch(registerSuccess({user,pwd,type}))
					
				}else{
					dispatch(errorMsg(res.data.msg))
				}
			})		
	}


}

export function regisger({user,pwd,repeatpwd,type}){
	if (!user||!pwd||!type) {
		return errorMsg('用户名密码必须输入')
	}
	if (pwd!==repeatpwd) {
		return errorMsg('密码和确认密码不同')
	}
	return dispatch=>{
		axios.post('/user/register',{user,pwd,type})
			.then(res=>{
				if (res.status==200&&res.data.code===0) {
					dispatch(registerSuccess({user,pwd,type}))
				}else{
					dispatch(errorMsg(res.data.msg))
				}
			})		
	}

}





