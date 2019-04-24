import React from 'react'
import { withRouter } from 'react-router-dom'
import { List, WhiteSpace, WingBlank, NavBar, Tabs, ListView } from 'antd-mobile'
import axios from 'axios'
import Constants from '../../constants'
import service from'./alacarte'


const Item = List.Item;
const Brief = Item.Brief;
const tabs = [
  { title: 'Alacarte Menu' },
  { title: 'Sets Menu' }
];

function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{ display: 'none' }}>you can custom body wrap element</span>
      {props.children}
    </div>
  );
}

const alacarteData = service.getAlaCarteMenu();
const setData = service.getSetMenu();
const NUM_SECTIONS = 5;
const NUM_ROWS_PER_SECTION = 5;
let pageIndex = 0;

const dataBlobs = {};
const data1Blobs = {};
let sectionIDs = [];
let rowIDs = [];
let row1IDs = [];
function genAlacarteData(pIndex = 0) {
  for (let i = 0; i < alacarteData.length; i++) {

    rowIDs[i] = [];

    const rowName = `R${i}`;
    rowIDs[i].push(alacarteData[i]);
    dataBlobs[rowName] = rowName;
  }
  rowIDs = [...rowIDs];
}

// function genSetData(pIndex = 0) {
//   for (let i = 0; i < setData.length; i++) {

//     rowIDs[i] = [];

//     const rowName = `R${i}`;
//     row1IDs[i].push(setData[i]);
//     data1Blobs[rowName] = rowName;
//   }
//   row1IDs = [...row1IDs];
// }

@withRouter
class Menu extends React.Component {

  constructor(props) {
    super(props);
    // const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

    const alacarteDataSource = new ListView.DataSource({
      // getRowData,
      // getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      // sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    const setsDataSource = new ListView.DataSource({
      // getRowData,
      // getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      // sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      data: [],
      alacarteDataSource,
      setsDataSource,
      isLoading: true,
      height: document.documentElement.clientHeight * 3 / 4,
    };
  }

  componentDidMount() {
    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);

    // simulate initial Ajax
    // setTimeout(() => {
      
    // }, 600);
    //genAlacarteData();
      this.setState({
        alacarteDataSource: this.state.alacarteDataSource.cloneWithRows(alacarteData),
        setsDataSource: this.state.setsDataSource.cloneWithRows(setData),
        isLoading: false,
      });
  }



  render() {
    let listHight = 0;
    if (document.getElementsByClassName('am-tab-bar-bar')[0]) {
      listHight = document.documentElement.clientHeight - 45 - 40 - document.getElementsByClassName('am-tab-bar-bar')[0].offsetHeight
    } else {
      listHight = document.documentElement.clientHeight - 45 - 40 - 50
    }

    let type = localStorage.getItem("type")
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
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
              borderBottom: '1px solid #F6F6F6',
            }}
          >{rowData.title}</div>
          <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
            <img style={{ height: '64px', marginRight: '15px' }} src={rowData.img} alt="" />
            <div style={{ lineHeight: 1 }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{rowData.title}</div>
              <div><span style={{ fontSize: '30px', color: '#FF6E27' }}>{rowData.price}</span> {rowData.des}</div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div>

        <NavBar className='fixd-header' mode='dark'>menu list</NavBar>

        <div style={{ marginTop: 45, height: listHight + 40 }}>
        <Tabs tabs={tabs}>
            <ListView
              ref={el => this.lv = el}
              dataSource={this.state.alacarteDataSource}
              renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                {this.state.isLoading ? 'Loading...' : 'Loaded'}
              </div>)}
              // renderSectionHeader={sectionData => (
              //   <div>{`Task ${sectionData.split(' ')[1]}`}</div>
              // )}
              renderBodyComponent={() => <MyBody />}
              renderRow={row}
              renderSeparator={separator}
              style={{
                height: listHight,
                overflow: 'auto',
              }}
              pageSize={4}
              onScroll={() => { console.log('scroll'); }}
              scrollRenderAheadDistance={500}
              // onEndReached={this.onEndReached}
              onEndReachedThreshold={10}
            />


            <ListView
              ref={el => this.lv1 = el}
              dataSource={this.state.setsDataSource}
              // renderHeader={() => <span>header</span>}
              renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                {this.state.isLoading ? 'Loading...' : 'Loaded'}
              </div>)}
              // renderSectionHeader={sectionData => (
              //   <div>{`Task ${sectionData.split(' ')[1]}`}</div>
              // )}
              renderBodyComponent={() => <MyBody />}
              renderRow={row}
              renderSeparator={separator}
              style={{
                height: listHight,
                overflow: 'auto',
              }}
              pageSize={4}
              onScroll={() => { console.log('scroll'); }}
              scrollRenderAheadDistance={500}
              // onEndReached={this.onEndReached}
              onEndReachedThreshold={10}
            />
            </Tabs>
          </div>
            </div >
        )
  }
}

export default Menu