import React, {useState, useEffect} from 'react'

const Counter = (props) => {

    const [seconds, setSeconds] = useState(0)

    const calculateTimeLeft = () => {
        const initialTime = props.initialTime
        
        return (new Date() - initialTime)
    }

    useEffect(() => {
        if(props.runTimer) {
            const timer = setTimeout(() => {
                setSeconds(calculateTimeLeft());
            }, 100)
        }
    })

    return (
        <div className="row">
            <h6 className="info col" style={{textAlign: "left"}}>Time (seconds): {Math.floor(seconds/1000)}</h6>
            <h6 className="info col" style={{textAlign: "center"}} id="rightCharactersCounter">Right characters: {props.rightCharacters}</h6>
            <h6 className="info col" style={{textAlign: "right"}} id="wrongCharactersCounter">Wrong characters: {props.wrongCharacters}</h6>
        </div>
    )
}

export default Counter
