import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  List,
  WhiteSpace,
  WingBlank,
  NavBar,
  Tabs,
  ListView
} from 'antd-mobile';
import axios from 'axios';
import Constants from '../../constants';
import service from './alacarte';

const Item = List.Item;
const tabs = [{ title: 'Share TeamMember' }, { title: 'Share point' }];

@withRouter
class Share extends React.Component {
  constructor(props) {
    super(props);
    // const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];

    this.state = {
      data: [],
      height: (document.documentElement.clientHeight * 3) / 4
    };
  }

  componentDidMount() {}

  clearSearchCondition() {
    this.searchBarInstance.setState({ value: '' });
    this.getAll();
  }

  getAll() {}

  render() {
    let listHight = 0;
    if (document.getElementsByClassName('am-tab-bar-bar')[0]) {
      listHight =
        document.documentElement.clientHeight -
        45 -
        40 -
        document.getElementsByClassName('am-tab-bar-bar')[0].offsetHeight;
    } else {
      listHight = document.documentElement.clientHeight - 45 - 40 - 50;
    }

    let type = localStorage.getItem('type');
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED'
        }}
      />
    );

    let index = alacarteData.length - 1;

    const row = (rowData, sectionID, rowID) => {
      return (
        <div key={rowData.id} style={{ padding: '0 15px' }}>
          <div
            style={{
              lineHeight: '50px',
              color: '#888',
              fontSize: 18,
              borderBottom: '1px solid #F6F6F6'
            }}
          >
            {rowData.title}
          </div>
          <div
            style={{
              display: '-webkit-box',
              display: 'flex',
              padding: '15px 0'
            }}
          >
            <img
              style={{ height: '64px', marginRight: '15px' }}
              src={rowData.img}
              alt=""
            />
            <div style={{ lineHeight: 1 }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                {rowData.title}
              </div>
              <div>
                <span style={{ fontSize: '30px', color: '#FF6E27' }}>
                  {rowData.price}
                </span>{' '}
                {rowData.des}
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div>
        <NavBar className="fixd-header" mode="dark">
          menu list
        </NavBar>

        <div style={{ marginTop: 45, height: listHight + 40 }}>
          <Tabs tabs={tabs}>
            <WingBlank>
              <SearchBar
                placeholder="Search"
                ref={ref => (this.searchBarInstance = ref)}
                onCancel={() => this.clearSearchCondition()}
                onSubmit={value => this.searchByPhone(value)}
              />

              <List
                id="member-list"
                className="my-list"
                style={{ height: listHight }}
              >
                {this.state.data.map(v => (
                  <Item
                    key={v.id}
                    arrow="horizontal"
                    onClick={() =>
                      this.props.history.push({
                        pathname: '/userDetail',
                        state: { detail: v }
                      })
                    }
                    //  extra={this.convertTimeToString(v.createTime)}
                    // >{v.phone}  total spend ${v.totalPayment}, has {(v.totalPayment * Constants.POINT_RATE).toFixed(2) - v.point} points</Item>
                  >
                    {v.phone} total spend ${v.totalPayment}, has {v.point}{' '}
                    points
                  </Item>
                ))}
              </List>
              {/* <Pagination total={5} current={1} locale={locale} /> */}
            </WingBlank>

            <WingBlank>
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

                  <InputItem
                    placeholder="How many points want to deduct"
                    error={!!getFieldError('deductedPoint')}
                    {...getFieldProps('deductedPoint', {
                      initialValue: this.state.deductedPoint
                    })}
                  >
                    Point
                  </InputItem>
                  <DatePicker
                    mode="date"
                    {...getFieldProps('dp', {
                      initialValue: this.state.dpValue,
                      rules: [
                        { required: true, message: 'Must select a date' },
                        { validator: this.validateDatePicker }
                      ]
                    })}
                  >
                    <List.Item arrow="horizontal">Date</List.Item>
                  </DatePicker>
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
                      size="small"
                      inline
                      style={{ marginLeft: '2.5px' }}
                      onClick={this.onReset}
                    >
                      Reset
                    </Button>
                  </List.Item>
                </List>
              </form>
            </WingBlank>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default Share;
