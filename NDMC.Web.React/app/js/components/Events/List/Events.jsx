import React from 'react'
import EventList from './EventList.jsx'
import EventFilters from '../Filters/EventFilters.jsx'
import { connect } from 'react-redux'
import { BeatLoader } from 'react-spinners'
import { Button, Footer, Container } from 'mdbreact'
import * as ACTION_TYPES from '../../../constants/action-types'

const queryString = require('query-string')

const mapStateToProps = (state, props) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

class Events extends React.Component {

  constructor(props) {
    super(props)

    this.backToTop = this.backToTop.bind(this)

    //Read polygon filter from URL
    const parsedHash = queryString.parse(location.hash.replace('/events?', ''))

    if (typeof parsedHash.polygon !== 'undefined') {

      //Dispatch to store
      this.props.loadPolygonFilter(parsedHash.polygon)
    }
  }

  backToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  componentWillMount() {
  }

  render() {
    return (
      <>
        <div style={{ position: 'fixed', right: '14%', bottom: '10px', zIndex: '99' }}>
          <Button color='secondary' className='btn-sm' onTouchTap={this.backToTop} >
            <i className='fa fa-arrow-circle-up' aria-hidden='true' />
            &nbsp;&nbsp;
            Back to top
          </Button>
        </div>
        <EventFilters />
        <EventList />
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Events)