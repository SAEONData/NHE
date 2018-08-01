'use strict'

//React
import React from 'react'
import { connect } from 'react-redux'

//Local
import EventCard from './EventCard.jsx'
import * as ACTION_TYPES from '../../../constants/action-types'

//GraphQL
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

//MDBReact
import { ToastContainer, toast } from 'react-toastify'
import { Button } from 'mdbreact'

const mapStateToProps = (state, props) => {
  let { filterData: { hazardFilter, regionFilter, dateFilter, impactFilter } } = state
  return {
    hazardFilter, regionFilter, dateFilter, impactFilter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

class EventList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hazardFilter: 0,
      regionFilter: 0,
      impactFilter: 0,
      dateFilter: {
        startDate: 0,
        endDate: 0
      },
      eventListSize: 10,
      bottomReached: false,
    }
    this.handleScroll = this.handleScroll.bind(this)
  }


  /*
  Checks for if the user scrolls to the bottom of the page and if they do change state
  to reflect this and increase the amount of events that can be displayed on the page
  */
  handleScroll() {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
    const body = document.body
    const html = document.documentElement
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const windowBottom = windowHeight + window.pageYOffset
    if (Math.ceil(windowBottom) >= docHeight) {
      this.setState({
        bottomReached: true,
        eventListSize: this.state.eventListSize + 10 //increase the amount of events that should be displayed by 10
      })
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    window.scrollTo(0, this.props.listScrollPos)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  /*
  Create a list of event cards to be used to populate the events page and parse in the relevant information for each event
  */
  buildList(events) {
    let ar = []
    for (let i of events) {
      let startdate = new Date(i.startDate * 1000)
      let enddate = new Date(i.endDate * 1000)
      if (i.typeEvent !== null && i.startDate && i.eventRegions[0] !== undefined) {
        ar.push(<EventCard key={i.eventId} eid={i.eventId} region={i.eventRegions[0].region} startdate={startdate.toDateString()} enddate={enddate.toDateString()} hazardtype={i.typeEvent.typeEventName} />)
      }
    }
    return ar
  }

  render() {
    let { hazardFilter, regionFilter, impactFilter, dateFilter } = this.props
    const GET_ALL_EVENTS = gql`
      {
        Events {
          eventId
          startDate
          endDate
          declaredEvents {
            declaredDate
          }
          typeEvent {
            typeEventName
            typeEventId
          }
          eventImpacts{
            typeImpact{
              typeImpactName
              typeImpactId
            }
            measure
          }
          eventRegions {
            region {
              regionName
              regionId
              parentRegionId
              regionType {
                regionTypeName
              }
            }
          }
        }
      }`
    return (
      <div>
        <ToastContainer
          hideProgressBar={true}
          newestOnTop={true}
          autoClose={2500}
        />
        <Query query={GET_ALL_EVENTS}>
          {({ loading, error, data }) => {
            if (loading) {
              toast.info('Fetching list of events')
              return <div>Loading...</div>
            }
            if (error) {
              toast.error('error fetching list from server')
              return <div>Unable to load events, please contact the site administrator</div>
            }
            toast.success('Successfully loaded Events!')
            const filteredData = data.Events.filter(event =>
              event.typeEvent &&
              event.startDate &&
              event.eventRegions[0]
            )
            this.state.bottomReached = false

            /*  Builds a list of events based on the relevant filters selected by the user.
                Region Filters need two filter methods as third level regions have no identifier for what
                their top level region is.
             */
            return this.buildList(filteredData
              .filter(event => hazardFilter === 0 ? true : event.typeEvent.typeEventId === hazardFilter)
              .filter(event => impactFilter === 0 ? true : event.eventImpacts.map(x => x.typeImpact.typeImpactId).includes(impactFilter))
              .filter(event => regionFilter === 0 ? true :
                event.eventRegions.map(x => x.region.parentRegionId).some(x => Array.isArray(regionFilter) ? regionFilter.includes(x) : x === regionFilter)
                ||
                event.eventRegions.map(x => x.region.regionId).some(x => Array.isArray(regionFilter) ? regionFilter.includes(x) : x === regionFilter))
              .filter(event => dateFilter.startDate === 0 ? true : event.startDate >= dateFilter.startDate && event.endDate <= dateFilter.endDate)
              .slice(0, this.state.eventListSize)
            )
          }}
        </Query>
      </div >
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventList)