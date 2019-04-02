import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import {List,WhiteSpace,WingBlank,NavBar,Icon, InputItem, Button,DatePicker} from 'antd-mobile'
import { createForm } from 'rc-form';
import axios from 'axios'
import Constants from '../../constants'

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const utcOffset = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
console.log(now, utcOffset, now.toISOString(), utcOffset.toISOString());

const Item = List.Item;
const Brief = Item.Brief;
@withRouter
class Account extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            passpord:"",
            confirmPassword:""
        }
    }

    componentDidMount() {
        
    }
    
    onSubmit = () => {
        this.props.form.validateFields({ force: true }, (error) => {
          if (!error) {
            let formData = this.props.form.getFieldsValue();

            if (formData.password !== formData.confirmPassword) {
               alert('New Password is not same with confirm password !')
                return;
            } 

            
            let record = {
                phone:sessionStorage.getItem("phone"),
                password:formData.password,
                updateTime:now.getTime()
            }
            axios.post(Constants.SERVICE_URL + '/user/updatePassword',record).
            then(res=>{
                if (res.status===200) {
                    // this.props.history.goBack();
                }
            })
          } else {
            console.log(error);
            alert('Validation failed');
          }
        });
      }
      
      onReset = () => {
        this.props.form.resetFields();
        setTimeout(() => console.log(this.state), 0);
      }

      
      validatePassword = (rule, value, callback) => {
        if (this.state.passpord === this.state.confirmPassword) {
          callback();
        } else {
          callback(new Error('New Password is not same with confirm password !'));
        }
      }

    handleChange(key,val){
		this.setState({
			[key]:val
		})
    }

    logout(){
        sessionStorage.removeItem("phone")
        sessionStorage.removeItem("type")
        this.props.history.push("/login")
    }
    
    render(){
        const { getFieldProps, getFieldError } = this.props.form;
        return (
            <div>
                <NavBar className='fixd-header' mode='dark'
                    
                >account</NavBar>
                <div style={{marginTop:45}}>
                    <WingBlank>
                    <form>
                        <List
                            className="date-picker-list"
                            renderFooter={() => getFieldError('password') && getFieldError('confirmPassword').join(',')}
                        >
                            <InputItem
                            onChange={v=>this.handleChange('password',v)}
                            placeholder="new password"
                            {...getFieldProps('password', {
                                initialValue: this.state.password,
                            })}
                            >New</InputItem>
                            <InputItem
                            onChange={v=>this.handleChange('confirmPassword',v)}
                            placeholder="confirm password"
                            {...getFieldProps('confirmPassword', {
                                initialValue: this.state.password,
                            })}
                            >Confirm</InputItem>

                            <List.Item>
                            <Button type="primary" size="small" inline onClick={this.onSubmit}>Submit</Button>
                            <Button size="small" inline style={{ marginLeft: '2.5px' }} onClick={this.onReset}>Reset</Button>
                            </List.Item>
                        </List>
                        </form>
                        <WhiteSpace />
                        <Button onClick={()=>this.logout()} type='primary'>Logout</Button>
                    </WingBlank>
            </div>
           </div>
        )
    }
}

export default createForm()(Account)