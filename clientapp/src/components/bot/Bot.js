import React, {Component} from "react";
import axios from 'axios/index';
import Message from "./Message";

class Bot extends Component {
    constructor(properties){
        super(properties);
        this.state = {
            messages: []//the state of the chatbot is initially an empty array. This array will store messages from the client
        }
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

        const res = await axios.post('/api/df_text_query', {text});//this sends the text to the query. {text} is same as {text: text}

        for(let m of res.data.fullfillmentMessages){
            input = {
                who: 'tyrone',
                message: m
            }
            this.setState({messages: [...this.state.messages, input]});//adding the bots comment(s) to the messages
        }
    }

    //this handles event messages
    async df_event_query(event){
        const res = await axios.post('/api/df_event_query',{event});

        for (let m of res.data.fullfillmentMessages){
            let input = {
                who: 'me',
                message: m
            };
            this.setState({messages: [...this.state.messages, input]});
        }
    }

    componentDidMount() {
        this.df_event_query('Welcome');
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

    render() {
        return(
            <div style={{height: 300, width: 300, float: 'right'}}>
                <div id='bot' style={{height: '100%', width: '100%', overflow: 'auto'}}>

                    <h3>This is the area where the chatbot will live.</h3>
                    {this.rendMessages(this.state.messages)}
                    <input type='text'/>
                </div>
            </div>
        );
    }
}

export default Bot;