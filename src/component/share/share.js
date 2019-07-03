import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  List,
  WhiteSpace,
  WingBlank,
  NavBar,
  Tabs,
  ListView,
  SearchBar,
  InputItem,
  Button
} from 'antd-mobile';
import { createForm } from 'rc-form';
import axios from 'axios';
import Constants from '../../constants';

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

  componentDidMount() {
    this.getAll();
  }

  clearSearchCondition() {
    this.searchBarInstance.setState({ value: '' });
    this.getAll();
  }

  getAll() {
    let userId = localStorage.getItem('userId');
    axios
      .post(Constants.SERVICE_URL + '/user/getAllTeamMembersByUserId', userId)
      .then(res => {
        if (res.status === 200) {
          this.setState({ data: res.data });
        }
      });
  }

  onSubmit = () => {};

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
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <div>
        <NavBar
          className="fixd-header"
          mode="dark"
          rightContent={[
            <Button
              size="small"
              type="primary"
              onClick={() => this.props.history.push('/shareDetail')}
            >
              +
            </Button>
          ]}
        >
          Share
        </NavBar>

        <div style={{ marginTop: 45, height: listHight + 40 }}>
          <Tabs tabs={tabs}>
            <WingBlank>
              <SearchBar
                placeholder="Search"
                ref={ref => (this.searchBarInstance = ref)}
                onCancel={() => this.clearSearchCondition()}
                onSubmit={value => this.onSubmit(value)}
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
                        pathname: '/shareDetail',
                        state: { detail: v }
                      })
                    }
                    //  extra={this.convertTimeToString(v.createTime)}
                    // >{v.phone}  total spend ${v.totalPayment}, has {(v.totalPayment * Constants.POINT_RATE).toFixed(2) - v.point} points</Item>
                  >
                    {v.phone} -- {v.name}
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
                    placeholder="How many points want to deduct"
                    error={!!getFieldError('point')}
                    {...getFieldProps('point', {
                      initialValue: this.state.point
                    })}
                  >
                    Point
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

export default createForm()(Share);
