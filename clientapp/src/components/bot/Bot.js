import React, {Component} from "react";
import axios from 'axios/index';
import Message from "./Message";
import Cookies from 'universal-cookie';
import {v4 as uuid} from 'uuid';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
// import Button from "react-bootstrap/Button";

const cookies = new Cookies();

class Bot extends Component {
    endOfMessages;//this will be used later for assigning new massages as the last message, so you don't need to scroll down to messages

    constructor(properties){
        super(properties);
        this._pressEnter = this._pressEnter.bind(this);//the binding ensures that the 'this'in this.keyPress works in the callback
        // this._clickSend = this._clickSend.bind(this);//the binding ensures that the 'this'in this.keyPress works in the callback
        // this.getLocation = this.getLocation.bind(this);
        // this.getCoordinates = this.getCoordinates.bind(this);
        this.state = {
            messages: [],//the state of the chatbot is initially an empty array. This array will store messages from the client
            welcome: false//this is initially false because the user hasn't yet received a welcome message from the bot
            //this is where lastMessage will go
        };
        if(cookies.get('uniqueId') === undefined){//ensures cookie is only created if one doesn't exist
            cookies.set('uniqueId', uuid(), {path: '/'});//path: '/' makes the cookie accessible everywhere
        }
        this.textRef = React.createRef();//this is the reference for the text box
    }

    // getLocation(){
    //     if (navigator.geolocation) {
    //         console.log(navigator.geolocation);
    //         navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationError);
    //     } else {
    //         console.log("Test");
    //         alert("Geolocation is not supported by this browser.");
    //     }
    // }
    //
    // getCoordinates(position){
    //     this.setState({
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude
    //
    //     });
    //     console.log("Lat: " + position.coords.latitude);
    //     console.log("Long: " + position.coords.longitude);
    //     console.log("State: " + this.state.latitude);
    // }

    // handleLocationError(error){
    //     switch(error.code) {
    //         case error.PERMISSION_DENIED:
    //             alert("User denied the request for Geolocation.");
    //             break;
    //         case error.POSITION_UNAVAILABLE:
    //             alert("Location information is unavailable.");
    //             break;
    //         case error.TIMEOUT:
    //             alert("The request to get user location timed out.");
    //             break;
    //         case error.UNKNOWN:
    //             alert("An unknown error occurred.");
    //             break;
    //         default:
    //             alert("Unknown error");
    //     }
    // }

    //this handles text messages
    async df_text_query(text){
        let input = {
            who: 'User',
            message: {//same format as the raw API response from dialogflow
                text: {
                    text: text
                }
            }
        };
        //adding input to messages state. Using a spread operator. messages becomes a new array, comprising of old array and new messages
        this.setState({messages: [...this.state.messages, input]});
        try {//the try/catch block handles situations in which the connection to dialogflow drops
            //this is a call to the backend. this sends the text, as well as the user's unique id to the query. {text} is same as {text: text}
            const res = await axios.post('/api/df_text_query', {text, uniqueId: cookies.get('uniqueId')});

            for (let m of res.data.fulfillmentMessages) {
                input = {
                    who: 'Tyrone',
                    message: m
                };
                this.setState({messages: [...this.state.messages, input]});//adding the bots comment(s) to the messages
            }
        }catch(error){
            let input ={
                who: 'Tyrone',
                message: {
                    text: {
                        text: "I have encountered some problems. Try again later and I'll try my best to help you out!"
                    }
                }
            };
            this.setState({messages: [...this.state.messages, input]});
        }
    }

    //this handles event messages
    async df_event_query(event){
        try {//the try/catch block handles situations in which the connection to dialogflow drops
            //this is a call to the backend
            const res = await axios.post('/api/df_event_query', {event, uniqueId: cookies.get('uniqueId')});
            for (let m of res.data.fulfillmentMessages) {
                let input = {
                    who: 'Tyrone',
                    message: m
                };
                this.setState({messages: [...this.state.messages, input]});
            }
        }catch(e){
            let input ={
                who: 'Tyrone',
                message: {
                    text: {
                        text: "I have encountered some problems. Try again later and I'll try my best to help you out!"
                    }
                }
            };
            this.setState({messages: [...this.state.messages, input]});
        }
    }

    async componentDidMount() {
        this.df_event_query('Welcome');
        //https://stackoverflow.com/questions/58830133/autofocus-on-input-when-opening-modal-does-not-work-react-bootstrap
        //focuses on the text box
        setTimeout(() => {
            this.textRef.current.focus();
        }, 1)
    }

    componentDidUpdate() {
        this.endOfMessages.scrollIntoView({behavior: 'smooth'});
    }

    rendMessages(stateMessages){
        if(stateMessages){
            return stateMessages.map((message, i) => {
                return <Message key={i} who={message.who} text={message.message.text.text}/>;
            });
            //get messages.length-1
            //use that as index and assign to string var and assign as end of messages
            //use state variable for this
        }else {
            return null;
        }
    }

    _pressEnter(event){
        if(event.key === 'Enter'){
            this.df_text_query(event.target.value);//event.target.value is the value taken from what the user submits
            event.target.value ="";//this empties the input field
        }
    }

    // _clickSend(event){
    //     console.log("E: " + event);
    //     // this.df_text_query(event);
    //     // event ="";//this empties the input field
    // }

    render() {
        return(
            <div>
                {/*<div>*/}
                {/*    <button onClick={this.getLocation}>Get</button>*/}
                {/*</div>*/}
                <div id='bot' style={{height: '100%', width: '100%', overflow: 'auto'}}>
                    {this.rendMessages(this.state.messages)}
                    {/*this ensures that, when the message is posted, and the component loads, endOfMessages becomes element*/}
                    <div ref={(element) => {this.endOfMessages = element;}}></div>
                    {/*<input type='text' onKeyPress={this._pressEnter} autoFocus/>*/}
                </div>
                <div>
                    <InputGroup className="mb-3" style={{paddingTop: 10}} onKeyPress={this._pressEnter} autoFocus>
                        <FormControl
                            placeholder="Enter text here..."
                            aria-label="User text"
                            aria-describedby="basic-addon2"
                            ref={this.textRef}//this is the referenece for the textbox, which autofocuses on it when the page loads
                        />
                        {/*<InputGroup.Append>*/}
                        {/*    /!*pass in lastMessage state variable here (onClick(lastMessage))*!/*/}
                        {/*    <Button variant="outline-primary" onClick={this._clickSend()}>Send</Button>*/}
                        {/*</InputGroup.Append>*/}
                    </InputGroup>
                </div>
            </div>
        );
    }
}

export default Bot;