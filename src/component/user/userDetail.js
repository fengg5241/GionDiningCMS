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
class UserDetail extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            phone:'',
            name:'',
            email:'',
            point:0,
            payment:0,
            isNew:true
        }
    }

    componentDidMount() {
        var detail = this.props.location.state && this.props.location.state.detail
        if(detail){ // passed from user list page
            this.setState({ 
                isNew: false,
                phone:detail.phone,
                name:detail.name,
                email:detail.email,
                point:(detail.totalPayment * Constants.POINT_RATE).toFixed(2) - detail.point,
                payment:detail.totalPayment
             });
        }else {
            this.setState({ isNew: true });
        }
    }
    
    onSubmit = () => {
        this.props.form.validateFields({ force: true }, (error) => {
          if (!error) {
            let formData = this.props.form.getFieldsValue();
            if(this.state.isNew){
                this.insert(formData);
            }else {
                this.update(formData);
            }
          } else {
            console.log(error);
            alert('Validation failed');
          }
        });
      }

      insert(formData){
        axios.get('/user/getByPhone/'+formData.phone).
        then(res=>{
            if(res.status===200){
                console.log(res);
                if(res.data.id){
                    alert(`The customer whose phone is ${formData.phone} already exist !`)
                }else {
                    let record = {
                        phone:formData.phone,
                        name:formData.name,
                        email:formData.email,
                        createTime:now.getTime(),
                        updateTime:now.getTime()
                    }
                    axios.post('/user/insert',record).
                    then(res=>{
                        if (res.status===200) {
                            this.props.history.goBack();
                        }
                    })
                }
                
            }
            
        })
      }

      update(formData){
        var detail = this.props.location.state && this.props.location.state.detail
        //Check if phone is changed
        if(detail.phone === formData.phone){ // phone no change
            let record = {
                id:detail.id,
                phone:formData.phone,
                name:formData.name,
                email:formData.email,
                updateTime:now.getTime()
                
            }
            axios.post('/user/update',record).
            then(res=>{
                if (res.status===200) {
                    this.props.history.goBack();
                }
            })
        }else {
            axios.get('/user/getByPhone/'+formData.phone).
            then(res=>{
                if(res.status===200){
                    console.log(res);
                    if(res.data.id){
                        alert(`The customer whose phone is ${formData.phone} already exist !`)
                    }else {
                        let record = {
                            id:detail.id,
                            phone:formData.phone,
                            name:formData.name,
                            email:formData.email,
                            updateTime:now.getTime()
                            
                        }
                        axios.post('/user/update',record).
                        then(res=>{
                            if (res.status===200) {
                                this.props.history.goBack();
                            }
                        })
                    }
                    
                }
                
            })
        }
        
      }
      
      onReset = () => {
        this.props.form.resetFields();
        setTimeout(() => console.log(this.state), 0);
      }

      onDelete = () => {
        var detail = this.props.location.state && this.props.location.state.detail
        let record = {
            id:detail.id,
            updateTime:Date.now()
        }
        axios.post('/user/delete',record).
        then(res=>{
            if (res.status===200) {
                this.props.history.goBack()
            }
        })

        setTimeout(() => console.log(this.state), 0);
      }
      

      validateIdp = (rule, date, callback) => {
        if (isNaN(Date.parse(date))) {
          callback(new Error('Invalid Date'));
        } else {
          const cDate = new Date(date);
          const newDate = new Date(+this.state.dpValue);
          newDate.setFullYear(cDate.getFullYear());
          newDate.setMonth(cDate.getMonth());
          newDate.setDate(cDate.getDate());
          // this.setState({ dpValue: newDate });
          setTimeout(() => this.props.form.setFieldsValue({ dp: newDate }), 10);
          callback();
        }
      }
      validateDatePicker = (rule, date, callback) => {
        // if (date && date.getMinutes() !== 15) {
        //   callback();
        // } else {
        //   callback(new Error('15 is invalid'));
        // }
        callback();
      }

    handleChange(key,val){
		this.setState({
			[key]:val
		})
    }

    save(){
        console.log(this.state)
    }
    
    render(){
        const { getFieldProps, getFieldError } = this.props.form;
        return (
            <div>
            <NavBar className='fixd-header' mode='dark'
            icon={<Icon type="left" />}
            onLeftClick={() => this.props.history.goBack()}
            >Detail</NavBar>
            <div style={{marginTop:45}}> 
            <form>
                <List
                    className="date-picker-list"
                    renderFooter={() => getFieldError('phone') && getFieldError('phone').join(',')}
                >
                    <InputItem
                    placeholder="Phone number cannot be empty"
                    error={!!getFieldError('phone')}
                    {...getFieldProps('phone', {
                        initialValue: this.state.phone,
                        rules: [
                        { required: true, message: 'Must type a phone number' },
                        ],
                    })}
                    >Phone</InputItem>
                     <InputItem
                    
                    placeholder="Name"
                    error={!!getFieldError('name')}
                    {...getFieldProps('name', {
                        initialValue: this.state.name,
                    })}
                    >Name</InputItem>
                    <InputItem
                    placeholder="Email"
                    error={!!getFieldError('email')}
                    {...getFieldProps('email', {
                        initialValue: this.state.email,
                    })}
                    >Email</InputItem>
                    <InputItem
                    disabled
                    placeholder="payment"
                    {...getFieldProps('payment', {
                        initialValue: this.state.payment,
                    })}
                    >Payment</InputItem>
                    <InputItem
                    disabled
                    placeholder="point"
                    {...getFieldProps('point', {
                        initialValue: this.state.point,
                    })}
                    >Point</InputItem>
                    {/* <InputItem
                    disabled
                    placeholder="point"
                    {...getFieldProps('point', {
                        initialValue: this.state.password,
                    })}
                    >Password</InputItem> */}


                    <List.Item>
                    <Button type="primary" size="small" inline onClick={this.onSubmit}>Submit</Button>
                    <Button size="small" inline style={{ marginLeft: '2.5px' }} onClick={this.onReset}>Reset</Button>
                    <Button type="warning" size="small" inline style={{ float:'right' }} onClick={this.onDelete}>Delete</Button>
                    </List.Item>
                </List>
                </form>

            {/* <WingBlank>
                <List>
                    {this.props.msg?<p className='error-msg'>{this.props.msg}</p>:null}
                    <InputItem
                        onChange={v=>this.handleChange('phone',v)}

                    >Phone</InputItem>
                    <WhiteSpace />
                    <InputItem
                        onChange={v=>this.handleChange('payment',v)}

                    >Payment</InputItem>
                    <WhiteSpace />
                    <InputItem
                        onChange={v=>this.handleChange('date',v)}

                    >Date</InputItem>
                </List>
                <WhiteSpace />
                <Button onClick={()=>this.save()} type='primary'>Save</Button>
            </WingBlank> */}
           </div>
           </div>
        )
    }
}

export default createForm()(UserDetail)