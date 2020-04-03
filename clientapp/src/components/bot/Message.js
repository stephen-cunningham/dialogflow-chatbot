import React from "react";
const Message = (properties) => {
    return(
        <div className="container">
            <div className='row'>
                <div className='d-flex justify-content-start mb-4'>
                    {/*the following ensures that the div will only be used if the bot (tyrone) is the one sending the message*/}
                    {properties.who === 'tyrone' &&
                        <div className='col-sm-3 img-fluid'>
                            <img src='/egg.jpg' alt ='Egg' className='rounded-circle' height='25' width ='25'/>
                            {properties.who}
                        </div>
                    }

                    <div className='col-sm-9'>
                        {properties.text}
                    </div>

                    {properties.who === 'user' &&
                        <div className='col-sm-3 img-fluid'>
                            <img src='/eggUser.jpg' alt='Egg User' className='rounded-circle' height='25' width ='25'/>
                            {properties.who}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
};

export default Message;