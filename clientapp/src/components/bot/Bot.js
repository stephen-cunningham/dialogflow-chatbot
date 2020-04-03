import React, {Component} from "react";
import axios from 'axios/index';
import Message from "./Message";
import Cookies from 'universal-cookie';
import {v4 as uuid} from 'uuid';

const cookies = new Cookies();

class Bot extends Component {
    endOfMessages;//this will be used later for assigning new massages as the last message, so you don't need to scroll down to messages

    constructor(properties){
        super(properties);
        this._keyPress = this._keyPress.bind(this);//the binding ensures that the 'this'in this.keyPress works in the callback
        this.state = {
            messages: []//the state of the chatbot is initially an empty array. This array will store messages from the client
        }
        if(cookies.get('uniqueId') === undefined){//ensures cookie is only created if one doesn't exist
            cookies.set('uniqueId', uuid(), {path: '/'});//path: '/' makes the cookie accessible everywhere
        }
        console.log(cookies.get('uniqueId'));
    }

    //this handles text messages
    async df_text_query(text){
        let input = {
            who: 'user',
            message: {//same format as the raw API response from dialogflow
                text: {
                    text: text
                }
            }
        };
        //adding input to messages state. Using a spread operator. messages becomes a new array, comprising of old array and new messages
        this.setState({messages: [...this.state.messages, input]});

        //this is a call to the backend. this sends the text, as well as the user's unique id to the query. {text} is same as {text: text}
        const res = await axios.post('/api/df_text_query', {text, uniqueId: cookies.get('uniqueId')});

        for(let m of res.data.fulfillmentMessages){
            input = {
                who: 'tyrone',
                message: m
            }
            this.setState({messages: [...this.state.messages, input]});//adding the bots comment(s) to the messages
        }
    }

    //this handles event messages
    async df_event_query(event){
        //this is a call to the backend
        const res = await axios.post('/api/df_event_query',{event, uniqueId: cookies.get('uniqueId')});
        for (let m of res.data.fulfillmentMessages){
            let input = {
                who: 'tyrone',
                message: m
            };
            this.setState({messages: [...this.state.messages, input]});
        }
    }

    componentDidMount() {
        this.df_event_query('Welcome');
    }

    componentDidUpdate() {
        this.endOfMessages.scrollIntoView({behavior: 'smooth'});
    }

    rendMessages(stateMessages){
        if(stateMessages){
            return stateMessages.map((message, i) => {
                return <Message key={i} who={message.who} text={message.message.text.text}/>;
            });
        }else {
            return null;
        }
    }

    _keyPress(event){
        if(event.key === 'Enter'){
            this.df_text_query(event.target.value);//event.target.value is the value taken from what the user submits
            event.target.value ="";//this empties the input field
        }
    }

    render() {
        return(
            <div style={{height: 500, width: 500, float: 'right'}}>
                <div id='bot' style={{height: '100%', width: '100%', overflow: 'auto'}}>
                    <h3>This is the area where the chatbot will live.</h3>
                    {this.rendMessages(this.state.messages)}
                    <div
                        ref={
                            (element) => {
                                this.endOfMessages = element;//now, when the message is posted, and the component loads, endOfMessages becomes element
                            }
                        }
                        style={{float: 'center'}}>
                    </div>
                    <input type='text' onKeyPress={this._keyPress} autoFocus/>
                </div>
            </div>
        );
    }
}

export default Bot;