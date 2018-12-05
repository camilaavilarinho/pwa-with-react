import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom'
import LoginContainer from './LoginContainer'
import ChatContainer from './ChatContainer'
import UserContainer from './UserContainer'
import './app.css'
import NotificationResource from '../resources/NotificationResource'

class App extends Component {

    state = { user: null, messages: [], messagesLoaded: false }

    onMessage = snapshot => {
        const messages = Object.keys(snapshot.val()).map(key => {
            const msg = snapshot.val()[key]
            msg.id = key
            return msg
        })
        this.setState({ messages })
    }

    handleSubmitMessage = msg => {
        const data = {
            msg,
            author: this.state.user.email,
            user_id: this.state.user.uid,
            timestamp: Date.now()
        }
        firebase
            .database()
            .ref('messages/')
            .push(data)
    }

    componentDidMount() {
        this.notifications = new NotificationResource(
            firebase.messaging(),
            firebase.database()
        )
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user })
                this.notifications.changeUser(user)
            } else {
                this.props.history.push('/login')
            }
        })
        firebase
            .database()
            .ref('/messages')
            .on('value', snapshot => {
                this.onMessage(snapshot)
                if (!this.state.messagesLoaded) {
                    this.setState({ messagesLoaded: true })
                }
            })
    }

    render() {
        return (
            <div id="container" className="inner-container">
                <Route path="/login" component={LoginContainer} />
                <Route
                    exact
                    path="/"
                    render={() => (
                        <ChatContainer
                            messagesLoaded={this.state.messagesLoaded}
                            onSubmit={this.handleSubmitMessage}
                            user={this.state.user}
                            messages={this.state.messages}
                        />
                    )}
                />
                <Route
                    exact
                    path="/users/:id"
                    render={({ history, match }) => (
                        <UserContainer
                            messages={this.state.messages}
                            messagesLoaded={this.state.messagesLoaded}
                            userID={match.params.id}
                        />
                    )} />
            </div>
        )
    }
}

export default withRouter(App);