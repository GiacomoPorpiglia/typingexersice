import React from 'react'

const Statistics = (props) => {

    if(props.showStatistics===true) {    
        return (
            <div className="row">
                    <h3 className="col1 text-center" id="time">Time: {props.stats.time} seconds</h3>
                    <h3 className="col1 text-center" id="totalWords">Total words: {props.stats.totalWords}</h3>
                    <h3 className="col1 text-center" id="correctWords">Correct words: {props.stats.correctWords}</h3>
                    <h3 className="col1 text-center" id="wpm">Wpm: {props.stats.wpm}</h3>
                    <h3 className="col1 text-center" id="cpm">Characters/min: {props.stats.cpm}</h3>

                    <div className="col1 text-center" >
                        <button className="btn btn-secondary" onClick={props.reset}>Restart!</button>
                </div> 
            </div>
        )
    }
    else {
        return (
            <>
            </>
        )
    }
}

export default Statistics
