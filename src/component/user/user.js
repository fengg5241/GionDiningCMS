import React from 'react'
import PropTypes from 'prop-types'
import {List,WhiteSpace,WingBlank,Pagination, Icon,SearchBar,NavBar,Button} from 'antd-mobile'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import Constants from '../../constants'

const Item = List.Item;
const Brief = Item.Brief;

const payType = {
    1:"Pay",
    2:"Pay Point"
}

class User extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            data:[]
        }
    }
    componentDidMount() {
        if(localStorage.getItem('phone')){
            let type = localStorage.getItem("type")
            if(type == 1){ // customer
                this.searchByPhone(localStorage.getItem("phone"))
            }else {
                this.getAll()
            }
        }
	}

    getAll(){
        axios.get(Constants.SERVICE_URL + '/user/getAllWithPoint').
        then(res=>{
            if(res.status===200){
                this.setState({data:res.data})
            }   
                
        })
    }
    convertTimeToString(time){
        return time ? time.slice(0, 10): "";
    }

    paymentType(type){
        return type == 1 ? "Pay $": "Pay Point";
    }

    searchByPhone(phone){
        if(phone){
            axios.get(Constants.SERVICE_URL + '/user/getUserWithPointByPhone/'+phone).
            then(res=>{
                if(res.status===200){
                    if(res.data){
                        this.setState({data:[res.data]})
                    }else{
                        this.setState({data:[]});
                        alert("This customer does not exist in our system !")
                    }
                    
                }
                
            })
        }else {
            this.getAll()
        }
        
    }

    clearSearchCondition(){
        this.searchBarInstance.setState({value:''});
        this.getAll()
    }

    render(){
        let listHight = 0;
        if (document.getElementsByClassName('am-tab-bar-bar')[0]) {
            listHight = document.documentElement.clientHeight - 45 - 40 - document.getElementsByClassName('am-tab-bar-bar')[0].offsetHeight
        }else{
            listHight = document.documentElement.clientHeight - 45 - 40 - 50
        }
        
        let type = localStorage.getItem("type")
        return (
            
            <div>
                {type == '1' ? <NavBar className='fixd-header' mode='dark'
                >user detail</NavBar>:
                <NavBar className='fixd-header' mode='dark'
                rightContent={[
                    <Button size="small" type='primary' onClick={()=>this.props.history.push('/userDetail')}>+</Button>,
                ]}
                >user list</NavBar>}

                <div style={{marginTop:45}}> 
                    <WingBlank>
                        {type == '1' ? null : 
                        <SearchBar placeholder="Search" 
                        ref={ref => this.searchBarInstance = ref}
                        onCancel={() => this.clearSearchCondition()}
                        onSubmit={value => this.searchByPhone(value)}/>}
                        
                        {/* <List renderHeader={() => 'Basic Style'} className="my-list"> */}
                
                        <List id="user-list" className="my-list" style={{'height':listHight}}>
                            {this.state.data.map(v=>(
                                <Item key={v.id} arrow="horizontal" 
                                onClick={()=>this.props.history.push({
                                    pathname: '/userDetail',
                                    state: { detail: v }
                                })}
                                //  extra={this.convertTimeToString(v.createTime)}
                                // >{v.phone}  total spend ${v.totalPayment}, has {(v.totalPayment * Constants.POINT_RATE).toFixed(2) - v.point} points</Item>
                                >{v.phone}  total spend ${v.totalPayment}, has {v.point} points</Item>
                            ))}
                        </List>
                        {/* <Pagination total={5} current={1} locale={locale} /> */}
                    </WingBlank>

                </div>
            </div>
           
        )
    }
}

export default withRouter(User)