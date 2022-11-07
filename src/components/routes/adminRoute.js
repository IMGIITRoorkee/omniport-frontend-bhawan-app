import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Loading } from 'formula_one'

class AdminRoute extends React.Component {

    state = {
        isAdmin: 'checking'
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
            if (who_am_i.isAdmin===true||who_am_i.isAdmin===false) {
                this.setState({
                    isAdmin: who_am_i.isAdmin
                })
            }
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

export default AdminRoute
