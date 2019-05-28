import React from 'react'
import PropTypes from 'prop-types'
import {List,WhiteSpace,WingBlank,Pagination, SearchBar,NavBar,Button} from 'antd-mobile'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import Constants from '../../constants'

const Item = List.Item;
const Brief = Item.Brief;

 
class Transaction extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            data:[]
        }
    }
    componentDidMount() {
        // this.props.getUserList('genius')
        if(!localStorage.getItem('phone')){
            return;
        }
        let type = localStorage.getItem("type")
        if(type == 1){ // customer
            this.searchByPhone(localStorage.getItem("phone"))
        }else {
            this.getAll()
        }
    }
    
    getAll(){
        axios.get(Constants.SERVICE_URL + '/transaction/getAll').
        then(res=>{
            if(res.status===200){
                this.setState({data:res.data})
            }
            
        })
    }

    convertTimeToString(time){
        return time ? time.slice(0, 10): "";
    }

    payType(point){
        return point >= 0 ? `Pay ${point ? point : 0}` : `Get ${point * -1}`;
    }

    searchByPhone(phone){
        if(phone){
            axios.get(Constants.SERVICE_URL + '/transaction/getAllByPhone/'+phone).
            then(res=>{
                if(res.status===200){
                    if(res.data){
                        this.setState({data:res.data})
                        if(res.data.length == 0) 
                        alert("This customer does not have any transactions !")
                    }else{
                        this.setState({data:[]});
                        
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
        let type = localStorage.getItem("type")
        if (document.getElementsByClassName('am-tab-bar-bar')[0]) {
            listHight = document.documentElement.clientHeight - 45 - 40 - document.getElementsByClassName('am-tab-bar-bar')[0].offsetHeight
        }else{
            listHight = document.documentElement.clientHeight - 45 - 40 - 50
        }

        return (
            <div>
                {type == '1' ? 
                <NavBar className='fixd-header' mode='dark'
                
                >transaction list</NavBar>:
                <NavBar className='fixd-header' mode='dark'
                        rightContent={[
                            <Button size="small" type='primary' onClick={()=>this.props.history.push('/transactionDetail')}>+</Button>,
                        ]}
                    >transaction list</NavBar>  
                }
                
                <div style={{marginTop:45}}>
                    <WingBlank>
                        {type == '1'? null:
                        <SearchBar placeholder="Search" 
                        ref={ref => this.searchBarInstance = ref}
                        onCancel={() => this.clearSearchCondition()}
                        onSubmit={value => this.searchByPhone(value)}/>}
                        
                        {/* <List renderHeader={() => 'Basic Style'} className="my-list"> */}
                        <List id="transaction-list" className="my-list" style={{'height':listHight}}>
                            {this.state.data.map(v=>(
                                <Item key={v.id} arrow="horizontal" 
                                onClick={()=>this.props.history.push({
                                    pathname: '/transactionDetail',
                                    state: { detail: v }
                                })}
                                extra={this.convertTimeToString(v.createTime)}>{v.user.phone}  pay ${v.payment} and {this.payType(v.point)} points for {v.comment}</Item>
                            ))}
                        </List>
                        {/* <Pagination total={5} current={1} locale={locale} /> */}
                    </WingBlank>
                </div>
           </div>
        )
    }
}

export default withRouter(Transaction)