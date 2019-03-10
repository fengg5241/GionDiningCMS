import React from 'react'
import PropTypes from 'prop-types'
import {List,WhiteSpace,WingBlank,Pagination, Icon} from 'antd-mobile'
import axios from 'axios'
import {withRouter} from 'react-router-dom'

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
        axios.get('/transaction/getAll').
            then(res=>{
                if(res.status===200){
                    this.setState({data:res.data})
                }
                
            })

        console.log(this.props);
        // let list = [{id:1,comment:'eat',type:'pay',money:100},
        //     {id:2,comment:'eat',type:'pay',money:200},
        //     {id:3,comment:'eat',type:'pay',money:100},
        //     {id:4,comment:'eat',type:'pay',money:200},
        //     {id:5,comment:'eat',type:'pay',money:200},
        //     {id:6,comment:'eat',type:'pay',money:100},
        //     {id:7,comment:'eat',type:'pay',money:200},
        //     {id:8,comment:'eat',type:'pay',money:200},
        //     {id:9,comment:'eat',type:'pay',money:100},
        //     {id:10,comment:'eat',type:'pay',money:200},
        //     {id:11,comment:'eat',type:'pay',money:200},
        //     {id:12,comment:'eat',type:'pay',money:100},
        //     {id:13,comment:'eat',type:'pay',money:200}]
        // this.setState({data:list})

	}

    convertTimeToString(time){
        return time ? time.slice(0, 10): "";
    }

    payType(point){
        return point >= 0 ? `Pay ${point ? point : 0}` : `Get ${point * -1}`;
    }
    render(){
       
        return (
           <WingBlank>
                {/* <List renderHeader={() => 'Basic Style'} className="my-list"> */}
                <List id="transaction-list" className="my-list">
                    {this.state.data.map(v=>(
                        <Item arrow="horizontal" 
                        onClick={()=>this.props.history.push({
                            pathname: '/transactionDetail',
                            state: { detail: v }
                          })}
                         extra={this.convertTimeToString(v.createTime)}>{v.user.phone}  pay ${v.payment} and {this.payType(v.point)} points for {v.comment}</Item>
                    ))}
                </List>
                {/* <Pagination total={5} current={1} locale={locale} /> */}
           </WingBlank>
        )
    }
}

export default withRouter(Transaction)