import React from 'react'
import { connect } from 'react-redux';
import {NavBar,SearchBar, Button,Flex, Icon,Modal} from 'antd-mobile'
import {Switch, Route} from 'react-router-dom'
import NavLinkBar from '../navLink/navLink'
import Transaction from '../transaction/transaction'
import User from '../user/user'
import Account from '../account/account'
function Customer(){
    return <h2>Customer list</h2>
}
function Msg(){
    return <h2>msg list</h2>
}

const prompt = Modal.prompt;


@connect(
    state=>state
)
class Dashboard extends React.Component {

    render(){
        let {pathname} = this.props.location
        let userType = sessionStorage.getItem("type")
        if(pathname === '/') pathname = "/transaction"
		const user = this.props.user
        const navList = [
            {
                path:'/transaction',
                text:'transaction',
                icon:'staff',
                component:Transaction,
                title:'transaction List'
                // hide:user.type=='staff'
            },
            // {
            //     path:'/',
            //     text:'transaction',
            //     icon:'staff',
            //     component:Transaction,
            //     title:'transaction List'
            //     // hide:user.type=='staff'
            // },
            // {
            //     path:'/customer',
            //     text:'customer',
            //     icon:'job',
            //     title:'Customer List',
            //     component:Customer,
            //     hide:user.type=='customer'
            // },
            // {
            //     path:'/msg',
            //     text:'message',
            //     icon:'msg',
            //     component:Msg,
            //     title:'Message List'
            // },
            {
                path:'/user',
                text:'user',
                icon:'user',
                component:User,
                title:'User Info'
            },
            {
                path:'/account',
                text:'account',
                icon:'job',
                component:Account,
                title:'Account Info'
            }
        ]

        return (
            <div>
                
            
            {/* <div style={{marginTop:45}}>  */}
                 <Switch>
                    <Route key="/" exact path="/" component={Transaction}></Route>
                    {navList.map(v=>(
                        <Route key={v.path} path={v.path} component={v.component}></Route>
                    ))}
                </Switch>

            {/* </div> */}
            {/* <NavLinkBar data={navList.filter(v=>v.path != "/")}></NavLinkBar> */}
            <NavLinkBar data={navList}></NavLinkBar>
            </div>
        )
    }
}

export default Dashboard