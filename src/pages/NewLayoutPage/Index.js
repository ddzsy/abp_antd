import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
// eslint-disable-next-line no-unused-vars
import styles from './Index.less';

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Index extends Component {
  state = {};

  render() {
    return (
      <div
        style={{
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>实际上是空布局</div>
        <Link to="/newPage">回到新页面</Link>
      </div>
    );
  }
}

export default Index;
