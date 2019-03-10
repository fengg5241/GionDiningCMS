import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import {List,WhiteSpace,WingBlank,NavBar,Icon, InputItem, Button,DatePicker} from 'antd-mobile'
import { createForm } from 'rc-form';
import axios from 'axios'

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const utcOffset = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
console.log(now, utcOffset, now.toISOString(), utcOffset.toISOString());

const Item = List.Item;
const Brief = Item.Brief;
@withRouter
class TransactionDetail extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            phone:'',
            payment:'',
            date:'',
            dpValue: now,
            point:0,
            idt: utcOffset.toISOString().slice(0, 10),
            isNew:true
        }
    }

    componentDidMount() {
        var detail = this.props.location.state && this.props.location.state.detail
        if(detail){ // passed from transaction list page
            this.setState({ 
                isNew: false,
                phone:detail.user.phone,
                payment:detail.payment,
                deductedPoint:detail.point,
                dpValue:new Date(detail.createTime)
             });
        }else {
            this.setState({ isNew: true });
        }
        console.log(detail)
    }
    
    saveTransaction = (userId,formData)=> {
        let record = {
            user:{id:userId},
            comment:'Food',
            point:formData.deductedPoint,
            payment:formData.payment,
            createTime:formData.dp,
            updateTime:now.getTime()
        }

        let operationType = "insert";
        if(!this.state.isNew){ // update
            var detail = this.props.location.state && this.props.location.state.detail
            record.id = detail.id;
            operationType = "update";
            
        }
        axios.post('/transaction/'+operationType,record).
        then(res=>{
            if (res.status===200) {
                this.props.history.goBack();
            }
        })
    }

    onSubmit = () => {
        this.props.form.validateFields({ force: true }, (error) => {
          if (!error) {
            let formData = this.props.form.getFieldsValue();
            const utcOffset = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
            
            if(formData.deductedPoint == 0){
                //only get user buy phone
                axios.get('/user/getByPhoneOrInsert/'+formData.phone).
                then(res=>{
                    if(res.status===200){
                        this.saveTransaction(res.data.id,formData);
                    }
                })
            }else {
                axios.get('/user/getByPhoneOrInsertWithPoint/'+formData.phone).
                then(res=>{
                    if(res.status===200){
                        // point balance
                        let pointBalance = res.data.totalPayment - res.data.point;
                        if(formData.deductedPoint <= pointBalance){
                            this.saveTransaction(res.data.id,formData);
                        }else {
                            alert(`There is no enough point to deduct! Only ${pointBalance} points left`);
                        }
                    }
                    
                })
            }
          } else {
            console.log(error);
            alert(error.deductedPoint.errors[0].message);
          }
        });
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
        axios.post('/transaction/delete',record).
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

    //   validateDeductedPoint = (rule, deductedPoint, callback) => {
    //     if(deductedPoint > this.state.point){
    //         callback(new Error('There is no enough points !'));
    //     }else {
    //         callback();
    //     }
    //   }

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
                    placeholder="Payment cannot be empty"
                    error={!!getFieldError('payment')}
                    {...getFieldProps('payment', {
                        initialValue: this.state.payment,
                        rules: [
                        { required: true, message: 'Must type the payment' },
                        ],
                    })}
                    >Payment</InputItem>
                    <InputItem
                    placeholder="How many points want to deduct"
                    error={!!getFieldError('deductedPoint')}
                    {...getFieldProps('deductedPoint', {
                        initialValue: this.state.deductedPoint,
                    })}
                    >Point</InputItem>
                    {/* <InputItem
                    placeholder=""
                    disabled
                    error={!!getFieldError('point')}
                    {...getFieldProps('point', {
                        initialValue: this.state.point + ' points still have',
                        
                    })}
                    >Balance</InputItem> */}
                    <DatePicker
                    {...getFieldProps('dp', {
                        initialValue: this.state.dpValue,
                        rules: [
                        { required: true, message: 'Must select a date' },
                        { validator: this.validateDatePicker },
                        ],
                    })}
                    >
                    <List.Item arrow="horizontal">Date</List.Item>
                    </DatePicker>
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

export default createForm()(TransactionDetail)