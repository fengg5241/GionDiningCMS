

export function getRedirectPath({type, avatar}){
	// 根据用户信息 返回跳转地址
	// user.type /boss /genius
	// user.avatar /bossinfo /geniusinfo 
	let url = (type==='staff')?'/staff': '/customer'
	// if (!avatar) {
	// 	url += 'info'
	// }
	// url = 'dashboard';
	return url
}
