import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Loading } from 'formula_one'
import { connect } from 'react-redux'

import { whoami } from "../../actions/who_am_i";

class AdminRoute extends React.Component {

    state = {
        isAdmin: 'checking'
    }

    componentDidMount() {
        this.props.whoami(this.successCallBack, this.errCallBack)
    }

    successCallBack() {
        this.setState({
            isAdmin: this.props.who_am_i.isAdmin
        })
    }

    errCallBack() {

    }

    componentDidUpdate(prevprops) {
        if (prevprops.who_am_i !== this.props.who_am_i) {
            this.setState({
                isAdmin: this.props.who_am_i.isAdmin
            })
        }
    }

    render() {
        const { component: C, 
                props: cProps, 
                constants, 
                who_am_i, 
                setNavigation, 
                activePost, 
                activeHostel, 
                ...rest 
            } = this.props
        const { isAdmin } = this.state

        if (isAdmin == 'checking') {
            return <Loading />
        }

        return (
            <Route {...rest} render={props => (
                isAdmin ? (
                    <C {...props} {...cProps}
                        constants={constants}
                        who_am_i={who_am_i}
                        setNavigation={setNavigation}
                        activeHostel={activeHostel}
                        activePost={activePost} />
                ) : (
                    <Redirect to='/404' />
                )
            )} />
        )
    }
}

const mapStateToProps = state => {
    return {
        who_am_i: state.who_am_i,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        whoami: (successCallBack, errCallBack) => {
            dispatch(whoami(successCallBack, errCallBack))
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminRoute)