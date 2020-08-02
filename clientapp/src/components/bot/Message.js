import React from "react";

const Message = (properties) => {
    return(
        <div className="container">
            <div>
                {/*the following ensures that the div will only be used if the bot (tyrone) is the one sending the message*/}
                {properties.who === 'Tyrone' &&
                    <div className='row border' style={{width: '100%'}}>
                        <div className='col-sm-1'>
                            <img src='/egg.jpg' alt ='Egg' className='rounded-circle' height='25' width ='25'/>
                            <br/>
                            {properties.who}
                        </div>
                        <div className='col-sm-11'>
                            {properties.text}
                        </div>
                    </div>
                }

                {properties.who === 'User' &&
                    <div className='row border' style={{width: '100%'}}>
                        <div className='col-sm-11 text-sm-right' style={{float: 'right'}}>
                            {properties.text}
                        </div>
                        <div className='col-sm-1 img-fluid'>
                            <img src='/eggUser.jpg' alt='Egg User' className='rounded-circle' height='25' width ='25'/>
                            <br/>
                            {properties.who}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
};

export default Message;