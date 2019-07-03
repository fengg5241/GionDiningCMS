import React from 'react';
import { withRouter } from 'react-router-dom';
import { List, NavBar, Icon, InputItem, Button, DatePicker } from 'antd-mobile';
import { createForm } from 'rc-form';
import axios from 'axios';
import Constants from '../../constants';

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const utcOffset = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

const Item = List.Item;
let oldPayment = 0;
let oldDeductedPoint = 0;
@withRouter
class ShareDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      payment: '',
      date: '',
      dpValue: now,
      point: 0,
      idt: utcOffset.toISOString().slice(0, 10),
      name: '',
      isNew: true
    };
  }

  componentDidMount() {
    var detail = this.props.location.state && this.props.location.state.detail;
    if (detail) {
      // passed from transaction list page
      this.setState({
        isNew: false,
        phone: detail.phone,
        name: detail.name
      });
    } else {
      this.setState({ isNew: true });
      document.getElementById('phoneInput')
        ? document.getElementById('phoneInput').focus()
        : '';
    }
  }

  convertTimeToString(time) {
    return time ? time.slice(0, 10) : '';
  }

  saveTransaction = (userId, formData) => {
    let deductPoint = formData.deductedPoint ? formData.deductedPoint : 0;
    let record = {
      user: { id: userId, name: formData.name },
      comment: 'Food',
      point: deductPoint,
      payment: formData.payment,
      createTime: formData.dp,
      updateTime: now.getTime()
    };

    let operationType = 'insert';
    if (!this.state.isNew) {
      // update
      var detail =
        this.props.location.state && this.props.location.state.detail;
      record.id = detail.id;
      operationType = 'update';
    }
    axios
      .post(Constants.SERVICE_URL + '/transaction/' + operationType, record)
      .then(res => {
        if (res.status === 200) {
          if (
            oldPayment != formData.payment ||
            oldDeductedPoint != deductPoint ||
            (formData.name && formData.name != '')
          ) {
            let changedPaymentPoint = (
              (formData.payment - oldPayment) *
              Constants.POINT_RATE
            ).toFixed(2);
            let changedDeductedPoint = (deductPoint - oldDeductedPoint).toFixed(
              2
            );

            let userPoint = {
              id: userId,
              point: changedPaymentPoint - changedDeductedPoint
            };
            if (formData.name && formData.name != '') {
              userPoint['name'] = formData.name;
            }
            axios
              .post(Constants.SERVICE_URL + '/user/addPoints', userPoint)
              .then(res => {
                if (res.status === 200) {
                  // Search point balance
                  axios
                    .get(Constants.SERVICE_URL + '/user/getById/' + userId)
                    .then(res => {
                      this.sendSMS(
                        formData.phone,
                        userPoint.point,
                        res.data.point
                      );
                    });

                  this.props.history.goBack();
                }
              });
          } else {
            this.props.history.goBack();
          }
        }
      });
  };

  sendSMS(phone, getPoint, pointBalance) {
    if (phone.length == 8) {
      //Singapore number
      phone = '65' + phone;
    }
    let text = `Dear Customer, your points have been changed, ${
      getPoint >= 0 ? '+' : ''
    }${getPoint}, current point balance is ${pointBalance}.Please go to http://gionpoint.com for details`;
    let paramObj = {
      username: 'Giondining',
      password: '12345',
      api_key: '8ibu4t8qkgqcutf',
      from: 'GionDining',
      to: phone,
      text: text,
      type: 'text'
    };

    axios
      .post(Constants.SERVICE_URL + '/sms/send', paramObj)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  onSubmit = () => {
    this.props.form.validateFields({ force: true }, error => {
      if (!error) {
        let formData = this.props.form.getFieldsValue();
        if (formData.deductedPoint == 0 || !formData.deductedPoint) {
          //only get user buy phone
          axios
            .get(
              Constants.SERVICE_URL +
                '/user/getByPhoneOrInsert/' +
                formData.phone
            )
            .then(res => {
              if (res.status === 200) {
                this.saveTransaction(res.data.id, formData);
              }
            });
        } else {
          axios
            .get(
              Constants.SERVICE_URL +
                '/user/getByPhoneOrInsertWithPoint/' +
                formData.phone
            )
            .then(res => {
              if (res.status === 200) {
                // point balance
                let pointBalance = res.data.point;
                // If create new, oldDeductedPoint is 0;
                //If update , just compare changed point
                if (formData.deductedPoint - oldDeductedPoint <= pointBalance) {
                  this.saveTransaction(res.data.id, formData);
                } else {
                  alert(
                    `There is no enough point to deduct! Only ${pointBalance} points left`
                  );
                }
              }
            });
        }
      } else {
        console.log(error);
        alert(error.deductedPoint.errors[0].message);
      }
    });
  };

  onReset = () => {
    this.props.form.resetFields();
    setTimeout(() => console.log(this.state), 0);
  };

  onDelete = () => {
    var detail = this.props.location.state && this.props.location.state.detail;
    let record = {
      id: detail.id,
      updateTime: Date.now()
    };
    axios
      .post(Constants.SERVICE_URL + '/transaction/delete', record)
      .then(res => {
        if (res.status === 200) {
          // Delete get or deducted point
          let formData = this.props.form.getFieldsValue();
          let deductedPoint = formData.deductedPoint
            ? formData.deductedPoint
            : 0;
          let userPoint = {
            id: detail.user.id,
            point:
              deductedPoint -
              (formData.payment * Constants.POINT_RATE).toFixed(2)
          };

          axios
            .post(Constants.SERVICE_URL + '/user/addPoints', userPoint)
            .then(res => {
              if (res.status === 200) {
                this.props.history.goBack();
              }
            });

          this.props.history.goBack();
        }
      });

    setTimeout(() => console.log(this.state), 0);
  };

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
  };
  validateDatePicker = (rule, date, callback) => {
    // if (date && date.getMinutes() !== 15) {
    //   callback();
    // } else {
    //   callback(new Error('15 is invalid'));
    // }
    callback();
  };

  //   validateDeductedPoint = (rule, deductedPoint, callback) => {
  //     if(deductedPoint > this.state.point){
  //         callback(new Error('There is no enough points !'));
  //     }else {
  //         callback();
  //     }
  //   }

  handleChange(key, val) {
    this.setState({
      [key]: val
    });
  }

  save() {
    console.log(this.state);
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    let userType = localStorage.getItem('type');

    return (
      <div>
        <NavBar
          className="fixd-header"
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.goBack()}
        >
          Detail
        </NavBar>
        <div style={{ marginTop: 45 }}>
          <form>
            <List
              className="date-picker-list"
              renderFooter={() =>
                getFieldError('phone') && getFieldError('phone').join(',')
              }
            >
              <InputItem
                id={'phoneInput'}
                placeholder="Phone number cannot be empty"
                ref={el => (this.phoneInput = el)}
                error={!!getFieldError('phone')}
                {...getFieldProps('phone', {
                  initialValue: this.state.phone,
                  rules: [
                    { required: true, message: 'Must type a phone number' }
                  ]
                })}
              >
                Phone
              </InputItem>
              <InputItem
                placeholder=""
                error={!!getFieldError('name')}
                {...getFieldProps('name', {
                  initialValue: this.state.name
                })}
              >
                Name
              </InputItem>

              <List.Item>
                <Button
                  type="primary"
                  size="small"
                  inline
                  onClick={this.onSubmit}
                >
                  Submit
                </Button>

                <Button
                  type="warning"
                  size="small"
                  inline
                  style={{ float: 'right' }}
                  onClick={this.onDelete}
                >
                  Delete
                </Button>
              </List.Item>
            </List>
          </form>
        </div>
      </div>
    );
  }
}

export default createForm()(ShareDetail);